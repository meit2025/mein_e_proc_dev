import '../css/index.scss';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/shacdn/form';
import {
  FieldArray,
  FieldArrayWithId,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shacdn/select';
import { Separator } from '@/components/shacdn/separator';
import { Textarea } from '@/components/shacdn/textarea';
import { Input } from '@/components/shacdn/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';
import { CustomDatePicker } from '@/components/commons/CustomDatePicker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/shacdn/scroll-area';
import * as React from 'react';
import {
  CREATE_API_BUSINESS_TRIP_DECLARATION,
  EDIT_API_BUSINESS_TRIP_DECLARATION,
  GET_DETAIL_BUSINESS_TRIP_DECLARATION,
  GET_EDIT_BUSINESS_TRIP_DECLARATION,
} from '@/endpoint/business-trip-declaration/api';
import { AllowanceItemModel, BusinessTripModel, BusinessTripType } from '../models/models';
import axiosInstance from '@/axiosInstance';
import moment from 'moment';
import FormSwitch from '@/components/Input/formSwitchCustom';
import { Button } from '@/components/shacdn/button';
import { ChevronsUpDown, Plus, UndoIcon, X } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { Inertia } from '@inertiajs/inertia';
import { useAlert } from '@/contexts/AlertContext';
import { Button as ButtonMui, filledInputClasses } from '@mui/material';
import {
  WorkflowApprovalDiagramInterface,
  WorkflowApprovalStepInterface,
  WorkflowComponent,
} from '@/components/commons/WorkflowComponent';
import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';

interface BusinessTripAttachement {
  id: number;
  url: string;
  file_name: string;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ACCEPTED_FILE_TYPES = [
  'heic',
  'image/heic',
  'image/heif',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
];

export const BussinessTripFormV1 = ({
  type,
  id,
}: {
  type: BusinessTripType;
  id: string | undefined;
}) => {
  const formSchema = z.object({
    request_no: z.string().nonempty('Request for required'),
    remark: z.string().nonempty('Remark is required'),
    attachment: z
      .array(
        z
          .instanceof(File)
          .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
            message: 'File type must be JPG, JPEG, PNG, HEIC or PDF',
          })
          .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: 'File size must be less than 1MB',
          }),
      )
      .min(1, 'Attachment is required'),
    total_destination: z.number().int('Total Destinantion Required'),
    cash_advance: z.boolean().nullable().optional(),
    reference_number: z.string().nullable().optional(),
    // total_percent: z.number().nullable().optional(),
    total_cash_advance: z.string().nullable().optional(),
    destinations: z.array(
      z.object({
        destination: z.string().nonempty('Destinantion Required'),
        business_trip_start_date: z.date().optional(),
        business_trip_end_date: z.date().optional(),
        detail_attedances: z.array(
          z.object({
            date: z.string().optional(),
            shift_code: z.string().optional(),
            shift_start: z.string().optional(),
            shift_end: z.string().optional(),
            start_time: z.string().optional(),
            end_time: z.string().optional(),
            start_date: z.string().optional(),
            end_date: z.string().optional(),
            request_start_time: z.string().optional(),
            request_end_time: z.string().optional(),
          }),
        ),
        allowances: z.array(
          z.object({
            name: z.string().optional(),
            code: z.string().optional(),
            default_price: z.string().optional(),
            type: z.string().optional(),
            currency: z.string().optional(),
            subtotal: z.number().optional(),
            detail: z.array(
              z.object({
                date: z.string().nullish(),
                request_price: z.number().optional(),
              }),
            ),
          }),
        ),
        other: z.array(
          z.object({
            value: z.number().optional(),
          }),
        ),
      }),
    ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request_no: '',
      remark: '',
      attachment: [],
      total_destination: 1,
      cash_advance: false,
      reference_number: '',
      total_percent: 0,
      total_cash_advance: '0',
      destinations: [
        {
          destination: '',
          business_trip_start_date: new Date(),
          business_trip_end_date: new Date(),
          detail_attedances: [],
          allowances: [],
          other: [{ value: 0 }],
        },
      ],
    },
  });

  const calculateTotal = (allowance: any, details: any) => {
    if (allowance.type === 'total') {
      const basePrice = parseFloat(details?.[0]?.request_price || 0);
      return basePrice;
    } else {
      return details?.reduce(
        (sum: number, item: any) => sum + parseFloat(item.request_price || 0),
        0,
      );
    }
  };

  const getTotalDes = () => {
    const alldestinations = form.getValues('destinations');
    const other = form.getValues('destinations.0.other');

    const totalAll = alldestinations.reduce(
      (destinationSum: number, destination: any, destinationIndex: number) => {
        const allowances = destination.allowances || [];

        const allowanceTotal = allowances.reduce(
          (allowanceSum: number, allowance: any, index: number) => {
            const details = form.getValues(
              `destinations.${destinationIndex}.allowances.${index}.detail`,
            );

            const itemTotal = calculateTotal(allowance, details);
            return allowanceSum + itemTotal;
          },
          0,
        );

        return destinationSum + allowanceTotal;
      },
      0,
    );

    let totalOther = 0; // Hanya dideklarasikan sekali

    try {
      totalOther = alldestinations.reduce(
        (otrSum: number, destination: any, destinationIndex: number) => {
          const other = destination.other || [];

          const othTotal = other.reduce((otherSum: number, allowance: any, index: number) => {
            const details = form.getValues(`destinations.${destinationIndex}.other.${index}.value`);

            return otherSum + (details === undefined ? 0 : details);
          }, 0);

          return otrSum + othTotal;
        },
        0,
      );
    } catch (error) {
      console.log(error);
      totalOther = 0;
    }

    return totalAll + totalOther;
  };
  const [otherAllowance, setOtherAllowance] = React.useState<boolean>(false);
  const { showToast } = useAlert();
  const [loading, setLoading] = React.useState(false);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(otherAllowance, ' valuesnya');
    try {
        setLoading(true);
      if (type === BusinessTripType.create) {
        const totalAll = getTotalDes();
        const formData = new FormData();
        formData.append('user_id', businessTripDetail.request_for?.id.toString() ?? '');
        formData.append('value', totalAll.toString());
        formData.append('request_no', values.request_no ?? '');
        formData.append('remark', values.remark ?? '');
        values.attachment.forEach((file: any, index: number) => {
          if (file) {
            formData.append(`attachment[${index}]`, file);
          }
        });
        formData.append('total_destination', `${values.total_destination}`);
        values.destinations.forEach((item, index) => {
          formData.append(`destinations[${index}]`, JSON.stringify(item));
        });
        await Inertia.post(CREATE_API_BUSINESS_TRIP_DECLARATION, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showToast('succesfully created data', 'success');
      } else {
        const formDataEdit = new FormData();
        formDataEdit.append('remark', values.remark ?? '');
        values.attachment.forEach((file: any, index: number) => {
          if (file) {
            formDataEdit.append(`attachment[${index}]`, file);
          }
        });
        fileAttachment.forEach((file: any, index: number) => {
          if (file) {
            formDataEdit.append(`file_existing[${index}]`, JSON.stringify(file));
          }
        });
        await Inertia.post(`${EDIT_API_BUSINESS_TRIP_DECLARATION}/${id}`, formDataEdit, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showToast('succesfully updated data', 'success');
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (e) {
      const error = e as AxiosError;
      console.log(error);
    }
  };

  const [businessTripDetail, setBusinessTripDetail] = React.useState<BusinessTripModel>([]);

  const [listAllowances, setListAllowances] = React.useState<AllowanceItemModel[]>([]);
  const [listDestination, setListDestination] = React.useState<[]>([]);

  const [isCashAdvance, setIsCashAdvance] = React.useState<boolean>(false);
//   console.log(otherAllowance);
  async function handleGetBusinessTrip(value: string) {
    form.setValue('request_no', value || '');
    const url = GET_DETAIL_BUSINESS_TRIP_DECLARATION(value);

    try {
      const response = await axiosInstance.get(url);
      const businessTripData = response.data.data;
    //   console.log(businessTripData, 'businessTripData');
      setIsCashAdvance(businessTripData.cash_advance == 1 ? true : false);
      form.setValue('remark', businessTripData.remarks || '');
      form.setValue('total_destination', businessTripData.total_destination || 1);
      form.setValue('cash_advance', businessTripData.cash_advance == 1 ? true : false);
      form.setValue('reference_number', businessTripData.reference_number);
      form.setValue('total_percent', businessTripData.total_percent);
      form.setValue('total_cash_advance', formatRupiah(businessTripData.total_cash_advance, false));
      setBusinessTripDetail(response.data.data as BusinessTripModel);
      setListDestination(businessTripData.destinations);
      setTotalDestination(businessTripData.total_destination);
      setAllowancesProperty(businessTripData.destinations);
    } catch (e) {
      console.log(e);
    }
  }

  const [totalDestination, setTotalDestination] = React.useState<string>('');

  const totalDestinationHandler = (value: string) => {
    const valueToInt = parseInt(value);
    setTotalDestination(value);
  };
  //   console.log(businessTripDetail, 'businessTripDetail');

  function setAllowancesProperty(destinations: any[]) {
    const destinationForm = destinations.map((destination) => ({
      destination: destination.destination || '', // Adjust field names as needed
      pajak: destination.pajak || '', // Adjust field names as needed
      purchasing_group: destination.purchasing_group || '', // Adjust field names as needed
      business_trip_start_date: new Date(destination.business_trip_start_date),
      business_trip_end_date: new Date(destination.business_trip_end_date),
      allowances: destination.allowances || [],
      detail_attedances: destination.detail_attedances || [],
      total_allowance: destination.total_allowance || 0,
      other: destination.other || [],
    }));
    form.setValue('destinations', destinationForm);
  }

  const {
    fields: destinationField,
    append,
    remove,
    update: updateDestination,
  } = useFieldArray({
    control: form.control,
    name: 'destinations',
  });

  React.useEffect(() => {}, [businessTripDetail, totalDestination]);

  const [totalAllowance, setTotalAllowance] = React.useState(0);
  const [isShow, setIsShow] = React.useState(false);
  const [approvalRoute, setApprovalRoute] = React.useState({
    approvalRequest: [],
    approvalFrom: [],
    acknowledgeFrom: [],
    approvalFromStatusRoute: [],
  });
  const fetchDataValue = async () => {
    try {
      const totalAll = getTotalDes();
      if (totalAll === 0) {
        showToast('Please fill the balance', 'error');
        return;
      }

      const response = await axiosInstance.get('/check-approval', {
        params: {
          value: totalAll,
          user_id: businessTripDetail.request_for?.id ?? '',
          type: 'TRIP_DECLARATION',
        },
      });
      if (response.data.status_code === 200) {
        const approvalRequest = response.data?.data?.approval.map(
          (route: any) => route?.division_name || null,
        );

        const approvalFrom = response.data?.data?.approval.map((route: any) => route?.name || null);

        const acknowledgeFrom: never[] = [];
        if (response.data?.data?.hr) {
          acknowledgeFrom.push(response.data?.data?.hr?.name as unknown as never);
        }

        const approvalFromStatusRoute = (response.data.data?.approval ?? []).map((route: any) => {
          return {
            status: '',
            name: route.name,
            dateApproved: '',
          };
        });

        const dataApproval = {
          approvalRequest,
          approvalFrom,
          acknowledgeFrom: acknowledgeFrom,
          approvalFromStatusRoute: approvalFromStatusRoute,
        };
        setApprovalRoute(dataApproval);
        setIsShow(true);
      }
    } catch (error) {
      showToast(error?.response?.data?.message, 'error');
    }
  };

  const { dataDropdown: dataRequestNo, getDropdown: getdataRequestNo } = useDropdownOptions();
  const { dataDropdown: dataRequestNoEdit, getDropdown: getdataRequestNoEdit } =
    useDropdownOptions();

  React.useEffect(() => {
    // const totalAll = getTotalDes();
    // if (totalAll > 0) {
    //   fetchDataValue();
    // }

    getdataRequestNo('', {
      name: 'request_no',
      id: 'id',
      tabel: 'business_trip',
      idType: 'string',
      where: {
        key: 'type',
        parameter: 'request',
      },
      declaration: 'true',
    });
  }, [form.watch('destinations')]);

  const [fileAttachment, setfileAttachment] = React.useState<BusinessTripAttachement[]>([]);

  async function getDetailData() {
    form.setValue('destinations', []);
    const url = GET_EDIT_BUSINESS_TRIP_DECLARATION(id);
    const response = await axios.get(url);
    const data = response.data.data;
    await handleGetBusinessTrip(data.parent_id.toString());
    setfileAttachment(data.attachments as BusinessTripAttachement[]);
    try {
    } catch (e) {
      const error = e as AxiosError;
    }
  }

  React.useEffect(() => {
    if (id && type == BusinessTripType.clone) {
      getDetailData();
      getdataRequestNoEdit('', {
        name: 'request_no',
        id: 'id',
        tabel: 'business_trip',
        idType: 'string',
        where: {
          key: 'type',
          parameter: 'request',
        },
      });
    }
  }, [type]);

  const handleDelete = (id: number) => {
    setfileAttachment((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <ScrollArea className='h-[600px] w-full '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <table className='text-xs mt-4 reimburse-form-table font-thin'>
            <tr>
              <td width={200}>Declaration No.</td>
              <td>DCLR-YYYY-MM-XXXXXXX</td>
            </tr>
            <tr>
              <td width={200}>Request No.</td>
              <td>
                <FormAutocomplete<any>
                  fieldLabel=''
                  options={dataRequestNo}
                  fieldName='request_no'
                  isRequired={true}
                  disabled={false}
                  placeholder={'Select Request No.'}
                  classNames='mt-2 w-full'
                  onChangeOutside={(value) => {
                    handleGetBusinessTrip(value);
                  }}
                />
              </td>
            </tr>
            {businessTripDetail && (
              <>
                <tr>
                  <td width={200}>Purpose Type</td>
                  <td className='text-sm'>{businessTripDetail.name_purpose}</td>
                </tr>
                <tr>
                  <td width={200}>Request for</td>
                  <td className='text-sm'>{businessTripDetail.name_request}</td>
                </tr>
                <tr>
                  <td width={200}>Cost Center</td>
                  <td className='text-sm'>{businessTripDetail?.cost_center?.company_code}</td>
                </tr>
              </>
            )}
            <tr>
              <td width={200}>Remark</td>
              <td>
                <FormField
                  control={form.control}
                  name='remark'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder='Insert remark'
                          {...field}
                          rows={4}
                          className='w-[300px]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
            </tr>
            <tr>
              <td width={200}>File Attachment<span className='text-red-600'>*</span></td>
              <td>
                <FormField
                  control={form.control}
                  name='attachment'
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel className='text-xs text-gray-500 font-extralight mb-1'>
                        Max File: 1000KB
                      </FormLabel> */}
                      <FormControl>
                        <input
                          className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                          type='file'
                          multiple // Menambahkan atribut multiple
                          accept='.jpg,.jpeg,.png,.pdf,.heic,.heif'
                          onChange={(e) => {
                            const files = e.target.files; // Ambil file yang dipilih
                            if (files) {
                              const fileArray = Array.from(files); // Konversi FileList ke Array
                              field.onChange(fileArray); // Panggil onChange dengan array file
                            } else {
                              field.onChange([]); // Jika tidak ada file, set array kosong
                            }
                          }}
                        />
                      </FormControl>
                      {form.formState.errors.attachment && (
                        <p className='text-[0.8rem] font-medium text-destructive'>
                          {Array.isArray(form.formState.errors.attachment)
                            ? form.formState.errors.attachment.map((error, index) => (
                                <span key={index}>{error.message}</span>
                              ))
                            : form.formState.errors.attachment.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </td>
            </tr>
            {fileAttachment.length > 0 && (
              <tr>
                <td width={200}></td>
                <td className='pb-3'>
                  {fileAttachment.map((attachment: any, index: number) => (
                    <div className='flex items-center gap-4'>
                      <a
                        href={attachment.url}
                        target='_blank'
                        className='text-blue-500 inline-block'
                        key={index}
                        rel='noreferrer'
                      >
                        {attachment.file_name}
                      </a>
                      <button
                        type='button'
                        onClick={() => handleDelete(attachment.id)}
                        className='text-red-500 mt-2 inline-block ml-2 cursor-pointer'
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </td>
              </tr>
            )}
            <tr>
              <td width={200}>File Extension</td>
              <td className='text-gray-500 text-xs font-extralight'>
                PDF, JPG, JPEG, PNG and HEIC Max 1mb
              </td>
            </tr>
            <tr>
              <td width={200}>Total Destination</td>
              <td>
                {' '}
                <FormField
                  control={form.control}
                  name='total_destination'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={totalDestination}
                          onValueChange={totalDestinationHandler}
                          disabled={true}
                        >
                          <SelectTrigger className='w-[200px] py-2'>
                            <SelectValue placeholder='-- Select Bussiness Trip --' />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 5 }, (_, index) => (
                              <SelectItem key={index} value={(index + 1).toString()}>
                                {' '}
                                {index + 1}{' '}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
            </tr>
          </table>
          <Separator className='my-4' />

          <BussinesTripDestination
            updateDestination={updateDestination}
            destinationField={destinationField}
            form={form}
            listAllowances={listAllowances}
            totalDestination={form.getValues('total_destination').toString()}
            setTotalAllowance={setTotalAllowance}
            businessTripDetail={businessTripDetail}
            type={type}
            btEdit={BusinessTripType.edit}
            setIsCashAdvance={setIsCashAdvance}
            isCashAdvance={isCashAdvance}
            setOtherAllowance={setOtherAllowance}
            otherAllowance={otherAllowance}
          />
          <Separator className='my-4' />
          <ButtonMui
            onClick={async () => await fetchDataValue()}
            variant='contained'
            color='primary'
            type='button'
          >
            Check Approval
          </ButtonMui>

          <div className='my-2'>
            {isShow && (
              <WorkflowComponent
                workflowApproval={{
                  approvalRequest: approvalRoute.approvalRequest,
                  approvalFrom: approvalRoute.approvalFrom,
                  acknowledgeFrom: approvalRoute.acknowledgeFrom,
                }}
                workflowApprovalStep={
                  approvalRoute.approvalFromStatusRoute as unknown as WorkflowApprovalStepInterface
                }
                workflowApprovalDiagram={
                  approvalRoute.approvalFrom as unknown as WorkflowApprovalDiagramInterface
                }
              />
            )}
          </div>

          <Button type='submit' loading={loading}>submit</Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export function BussinesTripDestination({
  totalDestination,
  listAllowances,
  form,
  destinationField,
  updateDestination,
  setTotalAllowance,
  businessTripDetail,
  type,
  btEdit,
  setIsCashAdvance,
  isCashAdvance,
  setOtherAllowance,
  otherAllowance,
}: {
  totalDestination: string;
  listAllowances: AllowanceItemModel[];
  form: any;
  destinationField: any;
  updateDestination: any;
  setTotalAllowance: any;
  businessTripDetail: any;
  type: any;
  btEdit: any;
  setIsCashAdvance: any;
  isCashAdvance: any;
  setOtherAllowance: any;
  otherAllowance: any;
}) {
  return (
    <Tabs defaultValue='destination1' className='w-full'>
      <TabsList className={'flex items-center justify-start space-x-4'}>
        {destinationField.map((field: any, index: number) => (
          <TabsTrigger value={`destination${index + 1}`}>Destination {index + 1}</TabsTrigger>
        ))}
      </TabsList>

      {destinationField.map((destination: any, index: number) => (
        <BussinessDestinationForm
          listAllowances={listAllowances}
          updateDestination={updateDestination}
          destination={destination}
          form={form}
          index={index}
          setTotalAllowance={setTotalAllowance}
          businessTripDetail={businessTripDetail}
          type={type}
          btEdit={BusinessTripType.edit}
          setIsCashAdvance={setIsCashAdvance}
          isCashAdvance={isCashAdvance}
          setOtherAllowance={setOtherAllowance}
          otherAllowance={otherAllowance}
        />
      ))}
    </Tabs>
  );
}

export function BussinessDestinationForm({
  form,
  index,
  destination,
  updateDestination,
  listAllowances,
  setTotalAllowance,
  businessTripDetail,
  type,
  btEdit,
  setIsCashAdvance,
  isCashAdvance,
  setOtherAllowance,
  otherAllowance,
}: {
  form: any;
  index: number;
  destination: any;
  updateDestination: any;
  listAllowances: any;
  setTotalAllowance: any;
  businessTripDetail: any;
  type: any;
  btEdit: any;
  setIsCashAdvance: any;
  isCashAdvance: any;
  setOtherAllowance: any;
  otherAllowance: any;
}) {
  const {
    fields: detailAttedanceFields,
    update: updateDetailAttedances,
    append: detailAttedanceAppend,
    remove: removeAttendace,
  } = useFieldArray({
    control: form.control,
    name: `destinations[${index}].detail_attedances`,
  });

  const {
    fields: allowancesField,
    update: updateAllowance,
    append: appendAllowance,
    remove: removeAllowance,
    replace: replaceAllowance,
  } = useFieldArray({
    control: form.control,
    name: `destinations[${index}].allowances`,
  });

  //generate detail
  //   console.log(destination, 'destination');

  function detailAttedancesGenerate() {
    let momentStart = moment(destination.business_trip_start_date).startOf('day');
    const momentEnd = moment(destination.business_trip_end_date).startOf('day');
    removeAttendace();
    removeAllowance();

    while (momentStart.isBefore(momentEnd) || momentStart.isSame(momentEnd)) {
      const object = {
        date: momentStart.toDate(),
        shift_code: 'SHIFTREGULAR',
        shift_start: '08:00',
        shift_end: '17:00',
        end_time: '17:00',
        start_time: '08:00',
      };

      momentStart = momentStart.add(1, 'days');
      detailAttedanceAppend(object);
    }

    function generateDetailAllowanceByDate(price: string): any[] {
      let momentStart = moment(destination.business_trip_start_date).startOf('day');
      const momentEnd = moment(destination.business_trip_end_date).startOf('day');
      const detailAllowance = [];

      while (momentStart.isBefore(momentEnd) || momentStart.isSame(momentEnd)) {
        const object = {
          date: momentStart.toDate(),
          shift_code: 'SHIFTREGULAR',
          shift_start: '08:00',
          shift_end: '17:00',
          end_time: '17:00',
          start_time: '08:00',
        };
        momentStart = momentStart.add(1, 'days');

        detailAllowance.push({
          date: momentStart.toDate(),
          request_price: price,
        });

        // console.log('date', momentStart.toDate());
      }

      //   console.log(detailAllowance, 'detail allowance');
      return detailAllowance;
    }

    // console.log(listAllowances, ' allowance');
    const allowancesForm = listAllowances.map((item: any) => {
      return {
        name: item.name,
        code: item.code,
        default_price: parseInt(item.grade_all_price),
        type: item.type,
        subtotal: parseInt(item.grade_all_price),
        currency: item.currency_id,
        request_value: item.request_value,
        detail:
          item.type.toLowerCase() == 'total'
            ? [
                {
                  date: null,
                  request_price: parseInt(item.grade_all_price),
                },
              ]
            : generateDetailAllowanceByDate(item.grade_all_price),
      };
    });

    replaceAllowance(allowancesForm);

    // console.log(allowancesForm, ' Formmm');
    // console.log('destination',destination)
  }

  function endDateHandler(value: Date | undefined) {
    updateDestination(index, {
      ...destination,
      business_trip_end_date: value,
    });
  }

  const handleCashAdvanceChange = (value: boolean) => {
    setIsCashAdvance(value);
  };

  const { setValue } = useFormContext();

  // Monitor total_percent value from form
  const totalPercent = useWatch({
    control: form.control,
    name: 'total_percent',
  });

  // Assuming allowance is calculated elsewhere, let's mock it for now
  const allowance = businessTripDetail.total_cash_advance; // Example: allowance is 1,000,000

  // Calculate total based on totalPercent and allowance
  React.useEffect(() => {
    // const percentValue = parseFloat(totalPercent || 0); // Ensure totalPercent is a number
    // const total = (percentValue / 100) * allowance; // Multiply percent with allowance
    // setValue('total_cash_advance', total.toFixed(2)); // Save the total in total_cash_advance field
  }, [allowance]); // Recalculate when totalPercent or allowance changes
  //   console.log(destination, 'destinationxxxx');
  return (
    <TabsContent value={`destination${index + 1}`}>
      <div key={index}>
        <table className='text-xs mt-4 reimburse-form-detail font-thin'>
          <tr>
            <td width={200}>Destination</td>
            <td>{destination.destination}</td>
          </tr>
          <tr>
            <td width={200}>Pajak</td>
            <td className='text-sm'>{destination?.pajak}</td>
          </tr>
          <tr>
            <td width={200}>Purchasing Group</td>
            <td className='text-sm'>{destination?.purchasing_group}</td>
          </tr>
          <tr>
            <td width={200}>Bussines Trip Date</td>
            <td className='flex space-x-2 items-center gap-3'>
              <span>{moment(destination.business_trip_start_date).format('DD/MM/YYYY')}</span>
              <span>To</span>
              <span>{moment(destination.business_trip_end_date).format('DD/MM/YYYY')}</span>
            </td>
          </tr>
        </table>

        <DetailAttedances
          detailAttedanceFields={detailAttedanceFields}
          form={form}
          updateAttedanceFields={updateDetailAttedances}
          destinationIndex={index}
        />
        <table className='text-xs mt-4 reimburse-form-detail font-thin'>
          <tr>
            <td className='text-sm'>Detail Bussines Trip Allowance:</td>
            <td></td>
          </tr>
        </table>
        <DetailAllowance
          allowanceField={allowancesField}
          destinationIndex={index}
          form={form}
          setOtherAllowance={setOtherAllowance}
          otherAllowance={otherAllowance}
        />
      </div>
      {/* disini */}
       <ResultTotalItem
        allowanceField={allowancesField}
        destinationIndex={index}
        form={form}
        setTotalAllowance={setTotalAllowance}
      />
      <table className='w-full text-sm mt-10'>
        <tr>
          <td className='w-[50%]'>Cash Advance</td>
          <td className='w-[50%] pb-0'>
            <FormSwitch
              fieldName={'cash_advance'}
              isRequired={false}
              disabled={true}
              //   disabled={
              //     type == BusinessTripType.edit ? (form.watch('cash_advance') ? false : true) : false
              //   }
              onChanges={(e) => handleCashAdvanceChange(e.target.checked)}
            />
          </td>
        </tr>
        {isCashAdvance && (
          <>
            <tr>
              <td className='w-[50%]'>Reference Number</td>
              <td className='w-[50%]' style={{ paddingBottom: 0 }}>
                <FormField
                  control={form.control}
                  name={'reference_number'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className='w-[50%] mb-2'
                          placeholder='Reference Number'
                          disabled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
            </tr>
            <tr>
              <td className='w-[50%]'>Total Percent</td>
              <td className='w-[50%]'>
                <FormField
                  control={form.control}
                  name={'total_percent'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          readOnly={true}
                          className='w-[50%]'
                          min='1'
                          max='100'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'total_cash_advance'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input value={field.value || ''} readOnly={true} className='w-[50%] mt-2' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
            </tr>
          </>
        )}
      </table>
    </TabsContent>
  );
}

export function DetailAttedances({
  form,
  destinationIndex,
  detailAttedanceFields,
  updateAttedanceFields,
}: {
  form: any;
  destinationIndex: number;
  detailAttedanceFields: any;
  updateAttedanceFields: any;
}) {
  const detailAttedanceWatch = form.watch(`destinations[${destinationIndex}].detail_attedances`);
  React.useEffect(() => {}, [detailAttedanceWatch]);

  React.useEffect(() => {
    // console.log(detailAttedanceFields, ' Detail Attedance fields');
  }, [detailAttedanceFields]);
  return (
    <table className='text-xs mt-4 reimburse-form-detail font-thin'>
      <tr>
        <td colSpan={2}>
          <div className='mb-4 text-sm'>Detail Attedance Business Trip Request: </div>
        </td>
      </tr>
      <tr>
        <td className='overflow-x'>
          <table className='detail-attedance text-xs table-auto overflow-scroll w-full'>
            <thead>
              <th>Date</th>
              <th>Shift code</th>
              <th>Shift Start</th>
              <th>Shift End</th>
              <th>Request Start Time</th>
              <th>Request End Time</th>
            </thead>
            <tbody>
              {detailAttedanceWatch.map((attedance: any, index: any) => (
                <tr key={attedance.index}>
                  <td style={{verticalAlign: 'middle'}}>
                    {moment(attedance.date).format('DD/MM/YYYY')}

                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={moment(field.value).format('YYYY-MM-DD')}
                              onChange={field.onChange}
                              type='hidden'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
                    {attedance.shift_code}
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.shift_code`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={moment(field.value).format('YYYY-MM-DD')}
                              onChange={field.onChange}
                              type='hidden'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
                    {attedance.shift_start}
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.shift_start`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={moment(field.value).format('YYYY-MM-DD')}
                              onChange={field.onChange}
                              type='hidden'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
                    {attedance.shift_end}
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.shift_end`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={moment(field.value).format('YYYY-MM-DD')}
                              onChange={field.onChange}
                              type='hidden'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
                    <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.detail_attedances.${index}.request_start_date`}
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input
                                defaultValue={moment(field.value).format('YYYY-MM-DD')}
                                onChange={field.onChange}
                                type='date'
                                readOnly={true}
                                style={{marginBottom: '5px'}}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.request_start_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input defaultValue={field.value} onChange={field.onChange} readOnly={true}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
                    <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.detail_attedances.${index}.request_end_date`}
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input
                                defaultValue={moment(field.value).format('YYYY-MM-DD')}
                                onChange={field.onChange}
                                type='date'
                                readOnly={true}
                                style={{marginBottom: '5px'}}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.request_end_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input defaultValue={field.value} onChange={field.onChange} readOnly={true} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td colSpan={2}>
          <div className='mb-4 text-sm'>Detail Attedance Business Trip Declaration: </div>
        </td>
      </tr>
      <tr>
        <td className='overflow-x'>
          <table className='detail-attedance text-xs table-auto overflow-scroll w-full'>
            <thead>
              <th>Date</th>
              <th>Shift code</th>
              <th>Shift Start</th>
              <th>Shift End</th>
              <th>Start Time</th>
              <th>End Time</th>
            </thead>
            <tbody>
              {detailAttedanceWatch.map((attedance: any, index: any) => (
                <tr key={attedance.index}>
                  <td style={{verticalAlign: 'middle'}}>
                    {moment(attedance.date).format('DD/MM/YYYY')}

                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={moment(field.value).format('YYYY-MM-DD')}
                              onChange={field.onChange}
                              type='hidden'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
                    {attedance.shift_code}
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.shift_code`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={moment(field.value).format('YYYY-MM-DD')}
                              onChange={field.onChange}
                              type='hidden'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
                    {attedance.shift_start}
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.shift_start`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={moment(field.value).format('YYYY-MM-DD')}
                              onChange={field.onChange}
                              type='hidden'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
                    {attedance.shift_end}
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.shift_end`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={moment(field.value).format('YYYY-MM-DD')}
                              onChange={field.onChange}
                              type='hidden'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
                    <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.detail_attedances.${index}.start_date`}
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input
                                defaultValue={moment(field.value).format('YYYY-MM-DD')}
                                onChange={field.onChange}
                                type='date'
                                style={{marginBottom: '5px'}}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.start_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input defaultValue={field.value} onChange={field.onChange} type='time'/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
                    <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.detail_attedances.${index}.end_date`}
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input
                                defaultValue={moment(field.value).format('YYYY-MM-DD')}
                                onChange={field.onChange}
                                type='date'
                                style={{marginBottom: '5px'}}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.end_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input defaultValue={field.value} onChange={field.onChange} type='time'/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  );
}

export function DetailAllowance({
  form,
  destinationIndex,
  allowanceField,
  setOtherAllowance,
  otherAllowance,
}: {
  form: any;
  destinationIndex: number;
  allowanceField: any;
  setOtherAllowance: any;
  otherAllowance: any;
}) {
  const detailAllowanceceWatch = form.watch(`destinations[${destinationIndex}].allowances`);
  React.useEffect(() => {}, [detailAllowanceceWatch]);

  // Field array untuk menyimpan other allowances
  const {
    fields: otherAllowances,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: `destinations.${destinationIndex}.other`, // Path field array
  });

  const watchedAllowances = useWatch({
    control: form.control,
    name: `destinations.${destinationIndex}.other`, // Mengawasi perubahan nilai
  });

  const calculateTotalOther = () => {
    return (watchedAllowances || []).reduce((total: number, allowance: any) => {
      const allowanceValue = Number(allowance?.value) || 0;

      // Pastikan allowanceValue adalah angka yang valid
      if (isNaN(allowanceValue)) {
        return total;
      }

      return total + allowanceValue;
    }, 0);
  };
  const addOtherAllowance = () => {
    append({ value: 0 }); // Tambahkan field baru ke array
  };

  return (
    <table className='w-full allowance-table'>
      {detailAllowanceceWatch.map((allowance: any, index: any) => (
        // eslint-disable-next-line react/jsx-key
        <AllowanceRowInput
          form={form}
          allowance={allowance}
          destinationIndex={destinationIndex}
          allowanceIndex={index}
        />
      ))}
      {otherAllowances.length === 0 && (
        <tr>
          <td>
            <Button type='button' className='text-xl' onClick={addOtherAllowance}>
              +
            </Button>
          </td>
        </tr>
      )}
      {otherAllowances.map((_, index) => (
        <tr key={index}>
          <td width={220} style={{ verticalAlign: 'middle' }} className='text-sm'>
            Other Allowance
          </td>
          <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>:</td>
          <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
            <span className='text-sm'>IDR</span>
          </td>
          <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
            <div className='flex items-center'>
              <FormField
                control={form.control}
                name={`destinations.${destinationIndex}.other[${index}].value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        min='0'
                        value={field.value ?? ''} // Gunakan string kosong jika nilai null/undefined
                        onChange={(e) => {
                            const value = e.target.value.trim(); // Hilangkan spasi ekstra

                            // Izinkan input kosong
                            if (value === '') {
                              field.onChange(undefined);
                              return;
                            }
                            console.log(value,'value')
                            // Pastikan hanya angka yang diterima
                            const parsedValue = Number(value);
                            if (!isNaN(parsedValue) && parsedValue >= 0) {
                              field.onChange(parsedValue);
                            }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className='text-sm'>* 100%</span>
            </div>
          </td>
          <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
            <div className='flex items-center'>
              <span className='text-sm' style={{ padding: '2px 5px' }}>
                = IDR {formatRupiah(calculateTotalOther(), false)}
              </span>
            </div>
          </td>
          <td>
            <Button type='button' className='text-xs' onClick={() => remove(index)}>
              X
            </Button>
          </td>
        </tr>
      ))}
    </table>
  );
}

export function AllowanceRowInput({
  form,
  allowance,
  destinationIndex,
  allowanceIndex,
}: {
  form: any;
  allowance: any;
  destinationIndex: any;
  allowanceIndex: any;
}) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState<number>(0);
  const handleClikRow = (index: number) => {
    setIsExpanded((prev) => !prev);
  };

  const basePrice = useWatch({
    control: form.control,
    name: `destinations[${destinationIndex}].allowances[${allowanceIndex}].detail[${0}].request_price`, // pastikan memantau field request_price
  });

  const details = useWatch({
    control: form.control,
    name: `destinations[${destinationIndex}].allowances[${allowanceIndex}].detail`,
  });

  const calculateTotal = () => {
    if (allowance.type === 'total') {
      // Pastikan basePrice tidak NaN atau undefined
      const price = parseFloat(basePrice || 0);
      return price * 1; // Menghitung total dengan basePrice
    } else {
      let total = 0;
      details?.forEach((detail: any) => {
        const price = parseFloat(detail.request_price || 0); // Pastikan parsing harga detail
        total += price; // Menghitung total dari setiap detail
      });
      return total;
    }
  };

  const handleChange = (index: number, value: string) => {
    // Parsing the input value to a float
    const parsedValue = parseFloat(value);
    // Ensure the value is a number or 0
    const requestPrice = isNaN(parsedValue) ? 0 : parsedValue;
    // Get the allowance type to apply validation logic
    const allowanceType = allowance.request_value; // Assuming `allowance` has a property 'type'
    // Define the validation logic based on the allowance type
    let isValid = true;
    // console.log(allowanceType);
    switch (allowanceType) {
      case 'unlimited':
        // No restrictions, any input is valid
        isValid = true;
        break;

      case 'fixed value':
        // Fixed nominal, you can set a predefined fixed value
        const fixedValue = allowance.default_price; // Example fixed value, change as needed
        if (requestPrice !== fixedValue) {
          alert(`Please enter the fixed value of IDR ${fixedValue}`);
          isValid = false;
        }
        break;

      case 'up to max value':
        // Set a maximum value limit
        const maxValue = allowance.default_price; // Example max value, change as needed
        if (requestPrice > maxValue) {
          alert(`The value should not exceed IDR ${maxValue}`);
          isValid = false;
        }
        break;

      default:
        isValid = false;
    }

    // Update the form value only if the input is valid
    if (isValid) {
      form.setValue(
        `destinations[${destinationIndex}].allowances[${allowanceIndex}].detail[${index}].request_price`,
        requestPrice,
      );

      // Hitung subtotal allowance ini
    const details = form.getValues(
        `destinations[${destinationIndex}].allowances[${allowanceIndex}].detail`
      );
    //   console.log(details,'details')
      const subtotal = details.reduce((total: number, detail: any) => {
        return total + (parseFloat(detail.request_price) || 0);
      }, 0);
    //   console.log(details,'detailsdetailsdetails')
      // Update subtotal di form
      form.setValue(
        `destinations[${destinationIndex}].allowances[${allowanceIndex}].subtotal`,
        subtotal
      );
    }
  };

  return (
    <>
      <tr key={allowance.id}>
        <td width={220} style={{ verticalAlign: 'middle' }} className='text-sm'>
          {allowance.name}
        </td>
        <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>:</td>
        <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
          {allowance.type == 'total' ? <span className='text-sm'>IDR</span> : <span></span>}
        </td>
        <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
          {allowance.type == 'total' ? (
            <div className='flex items-center'>
              <FormField
                control={form.control}
                name={`destinations[${destinationIndex}].allowances[${allowanceIndex}].detail[${0}].request_price`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={(e) => handleChange(0, e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className='text-sm'>* 100%</span>
            </div>
          ) : (
            <span className='text-sm'>
              {' '}
              {allowance.detail.length} Days * {formatRupiah(allowance.default_price, false)} * 100%
            </span>
          )}
        </td>
        <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
          <div className='flex items-center'>
            <span className='text-sm total' style={{ padding: '2px 5px' }}>
              = IDR {formatRupiah(calculateTotal(), false)}
            </span>
          </div>
        </td>
        {allowance.type == 'total' ? (
          <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}></td>
        ) : (
          <td
            style={{ verticalAlign: 'middle', padding: '2px 5px' }}
            onClick={() => handleClikRow(allowanceIndex)}
          >
            <Button variant='ghost' type='button' size='sm' className='w-9 p-0'>
              <ChevronsUpDown className='h-4 w-4' />
              <span className='sr-only'>Toggle</span>
            </Button>
          </td>
        )}
      </tr>

      {isExpanded && (
        <>
          {allowance.detail.map((detail: any, detailIndex: number) => (
            <tr key={detail.id}>
              <td className='text-end' style={{ verticalAlign: 'middle' }}>
                <span className='text-sm'>{moment(detail.date).format('DD/MM/YYYY')}</span>{' '}
              </td>
              <td style={{ padding: '8px 2px', verticalAlign: 'middle' }}>:</td>
              <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
                <span className='text-sm'>IDR</span>
              </td>
              <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
                <div className='flex mt-1 text-sm justify-between items-center'>
                  <FormField
                    control={form.control}
                    name={`destinations[${destinationIndex}].allowances[${allowanceIndex}].detail[${detailIndex}].request_price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            value={field.value} // Ensure proper value binding
                            onChange={(e) => handleChange(detailIndex, e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </td>
              <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}></td>
              <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}></td>
            </tr>
          ))}
        </>
      )}
    </>
  );
}

export function ResultTotalItem({
    allowanceField,
    destinationIndex,
    form,
    setTotalAllowance,
  }: {
    allowanceField: any;
    destinationIndex: number;
    form: any;
    setTotalAllowance: any;
  }) {
    const [grandTotal, setGrandTotal] = React.useState(0);
    const other = form.watch(`destinations.${destinationIndex}.other`);
    const resultItem = form.watch(`destinations[${destinationIndex}].allowances`);
    // const totalItem = form.watch(`destinations[${destinationIndex}].total_allowance`);
    // const total = form.watch(`destinations[${destinationIndex}].allowances[${allowanceIndex}].detail`)
      // console.log(allowanceField,' lorem isum')
    React.useEffect(() => {
        const newTotal = resultItem.reduce((totalSum: number, allowance: any, index: number) => {
            const details = form.getValues(`destinations.${destinationIndex}.allowances.${index}.detail`);
            const itemTotal = calculateTotal(allowance, details);
            return totalSum + itemTotal;
        }, 0);
        const totalSubtotal = (other || []).reduce((total: number, allowance: any) => {
            const allowanceValue = Number(allowance?.value) || 0; // Pastikan nilai adalah angka atau default ke 0
            return total + allowanceValue;
        }, 0);
        console.log(other,'other')
        setGrandTotal(newTotal + totalSubtotal);
    //       // Update nilai total allowance di form
    //       form.setValue(`destinations[${destinationIndex}].total_allowance`, total);

    //       // Panggil fungsi setTotalAllowance jika diperlukan di luar
    //       // setTotalAllowance(total);
        }, [resultItem, form.watch()]);
        const calculateTotal = (allowance: any, details: any) => {
            if (allowance.type === 'total') {
              const basePrice = parseFloat(details?.[0]?.request_price || 0);
              return basePrice;
            } else {
              return details?.reduce(
                (sum: number, item: any) => sum + parseFloat(item.request_price || 0),
                0,
              );
            }
          };
    return (
      <>
        <table className='w-full text-sm mt-10'>
          <thead>
            <tr>
              <th className='w-[50%]'>Item</th>
              <th className='w-[50%]'>Sub Total</th>
            </tr>
          </thead>
          <tbody>
            {resultItem.map((allowance: any, index: number) => (
              <tr key={allowance.id}>
                <td>{allowance.name}</td>
                <td className='flex justify-between pr-4'>
                  <span>IDR</span>
                  <span>{formatRupiah(allowance.subtotal)}</span>
                </td>
              </tr>
            ))}
            {other.length > 0 && (
                <>
                    {other.map((allowance: any, index: number) => (
                        <tr key={index}>
                            <td>Other Allowance</td>
                            <td className='flex justify-between pr-4'>
                                <span>IDR</span>
                                <span>{allowance?.value ? formatRupiah(allowance.value) : '0'}</span>
                            </td>
                        </tr>
                    ))}
                </>
            )}
          </tbody>
          <tfoot className='mt-4'>
            <tr>
              <td>
                <i>Total Allowance</i>
              </td>
              <td className='flex justify-between pr-4'>
                <span>IDR</span>
                <span>{formatRupiah(grandTotal)}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </>
    );
  }
