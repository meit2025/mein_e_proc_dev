import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/shacdn/form';

import { z } from 'zod';

import { Inertia } from '@inertiajs/inertia';

import { Button } from '@/components/shacdn/button';
import { ChevronsUpDown, Plus, UndoIcon, X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  FieldArray,
  FieldArrayWithId,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { Textarea } from '@/components/shacdn/textarea';

import '../css/index.scss';
import { ScrollArea } from '@/components/shacdn/scroll-area';
import { Separator } from '@/components/shacdn/separator';

import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shacdn/collapsible';

import moment from 'moment';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shacdn/select';
import { CustomDatePicker } from '@/components/commons/CustomDatePicker';
import { Input } from '@/components/shacdn/input';
import * as React from 'react';
import { PurposeTypeModel } from '../../PurposeType/models/models';
import { GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE } from '@/endpoint/purpose-type/api';
import axiosInstance from '@/axiosInstance';
import {
  AllowanceItemModel,
  BusinessTripType,
  Costcenter,
  Pajak,
  PurchasingGroup,
} from '../models/models';
import { Item } from '@radix-ui/react-dropdown-menu';
import Detail from '@/Pages/User/Api/Detail';
import { AllowanceForm } from '../../AllowanceCategory/components/AllowaceForm';
import axios, { AxiosError } from 'axios';
import { CREATE_API_BUSINESS_TRIP, GET_DETAIL_BUSINESS_TRIP } from '@/endpoint/business-trip/api';
import FormSwitch from '@/components/Input/formSwitchCustom';
import FormAutocomplete from '@/components/Input/formDropdown';
import { DestinationModel } from '../../Destination/models/models';
import { useAlert } from '@/contexts/AlertContext';

interface User {
  id: string;
  nip: string;
  name: string;
}

interface Type {
  id: string;
  code: string;
  name: string;
}

interface CurrencyModel {
  id: string;
  code: string;
}

interface Props {
  users: User[];
  listPurposeType: PurposeTypeModel[];
}

const formSchema = z.object({
  remark: z.string().min(1).max(50),
  reimburse_cost: z.number(),
});

const dummyPrice = 25000;
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const BussinessTripFormV1 = ({
  users,
  listPurposeType,
  pajak,
  costcenter,
  purchasingGroup,
  type,
  id,
  role,
  idUser,
  listDestination = [],
}: {
  users: User[];
  listPurposeType: PurposeTypeModel[];
  pajak: Pajak[];
  costcenter: Costcenter[];
  purchasingGroup: PurchasingGroup[];
  type: BusinessTripType;
  id: string | undefined;
  role: string | undefined;
  idUser: number | undefined;
  listDestination: DestinationModel[];
}) => {
  const formSchema = z.object({
    purpose_type_id: z.string().min(1, 'Purpose type required'),
    request_for: z.string().min(1, 'Request for required'),
    cost_center_id: z.string().min(1, 'Cost Center for required'),
    pajak_id: z.string().min(1, 'Pajak for required'),
    purchasing_group_id: z.string().min(1, 'Purchasing Group for required'),
    remark: z.string().min(1, 'Remark is required'),
    attachment: z.instanceof(File).nullable().optional(),
    total_destination: z.number().min(1, 'Total Destinantion Required'),
    cash_advance: z.boolean().nullable().optional(),
    total_percent: z.string().nullable().optional(),
    total_cash_advance: z.string().nullable().optional(),
    destinations: z.array(
      z.object({
        destination: z.string().min(1, 'Destinantion Required'),
        business_trip_start_date: z.date().optional(),
        business_trip_end_date: z.date().optional(),
        detail_attedances: z.array(
          z.object({
            date: z.date().optional(),
            shift_code: z.string().optional(),
            shift_start: z.string().optional(),
            shift_end: z.string().optional(),
            start_time: z.string().optional(),
            end_time: z.string().optional(),
          }),
        ),
        allowances: z.array(
          z.object({
            name: z.string().optional(),
            code: z.string().optional(),
            default_price: z.number().optional(),
            type: z.string().optional(),
            subtotal: z.number().optional(),
            currency: z.string().optional(),
            detail: z.array(
              z.object({
                date: z.date().nullish(),
                request_price: z.any().optional(),
              }),
            ),
          }),
        ),
      }),
    ),
  });
  const [totalDestination, setTotalDestination] = React.useState<string>('1');

  console.log('list destiantion', listDestination);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose_type_id: '',
      request_for: '',
      cost_center_id: '',
      pajak_id: '',
      purchasing_group_id: '',
      remark: '',
      attachment: null,
      total_destination: 1,
      cash_advance: false,
      total_percent: '0',
      total_cash_advance: '0',
      destinations: [
        {
          detail_attedances: [],
          allowances: [],
          destination: '',
          business_trip_start_date: new Date(),
          business_trip_end_date: new Date(),
        },
      ],
    },
  });

  interface Destination {
    destination: string;
    detail_attedances: any[];
    allowances: any[];
    business_trip_start_date: Date;
    business_trip_end_date: Date;
  }

  async function getDetailData() {
    const url = GET_DETAIL_BUSINESS_TRIP(id);

    try {
        const response = await axios.get(url);
        const data = response.data.data;
        console.log(data, ' Response Detailxxxx');
        form.setValue('purpose_type_id', data.purpose_type_id);
        form.setValue('request_for', data.request_for.id);
        form.setValue('cost_center_id', data.cost_center_id);
        form.setValue('pajak_id', data.pajak_id);
        form.setValue('purchasing_group_id', data.purchasing_group_id);
        form.setValue('remark', data.remarks);
        form.setValue('total_destination', data.total_destination);
        form.setValue('destinations',[]);
        form.setValue('destinations',
            data.destinations.map((destination: any) => ({
                destination: destination.destination,
                business_trip_start_date: new Date(destination.business_trip_start_date),
                business_trip_end_date: new Date(destination.business_trip_end_date),
                detail_attedances: destination.detail_attedances,
                allowances: destination.allowances
            }))
        );

        // form.trigger('destinations');
        // console.log(form.getValues('destinations'),'Form Destinations');

    } catch (e) {
      const error = e as AxiosError;
    }
  }

  const [listAllowances, setListAllowances] = React.useState<AllowanceItemModel[]>([]);

  const [selectedUserId, setSelectedUserId] = React.useState(
    role === 'user' ? idUser.toString() : '',
  );

  async function handlePurposeType(value: string) {
    form.setValue('purpose_type_id', value || '');
    const userid = role == 'user' ? idUser || '' : selectedUserId || '';
    console.log(userid, ' ---- ')
    const url = GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE(value, userid);

    try {
      const response = await axiosInstance.get(url);
      setListAllowances(response.data.data as AllowanceItemModel[]);
    } catch (e) {
      //   console.log(e);
    }
  }

  const totalDestinationHandler = (value: string) => {
    form.setValue('total_destination', parseInt(value, 10));
    setTotalDestination(value);
    setAllowancesProperty();
    // let valueToInt = parseInt(value);
  };

  const { showToast } = useAlert();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      // Append group data
      formData.append('purpose_type_id', values.purpose_type_id ?? '');
      formData.append('request_for', values.request_for ?? '');
      formData.append('cost_center_id', values.cost_center_id ?? '');
      formData.append('pajak_id', values.pajak_id ?? '');
      formData.append('purchasing_group_id', values.purchasing_group_id ?? '');
      formData.append('remark', values.remark ?? '');
      formData.append('attachment', values.attachment ?? '');
      formData.append('total_destination', `${values.total_destination}`);
      formData.append('cash_advance', `${values.cash_advance}`);
      formData.append('total_percent', `${values.total_percent}`);
      formData.append('total_cash_advance', `${values.total_cash_advance}`);
      values.destinations.forEach((item, index) => {
        const itemCopy = {
          ...item,
          business_trip_start_date: moment(item.business_trip_start_date).format('YYYY-MM-DD'),
          business_trip_end_date: moment(item.business_trip_end_date).format('YYYY-MM-DD'),
          detail_attedances: item.detail_attedances.map((detail) => {
            return {
              ...detail,
              date: moment(detail.date).format('YYYY-MM-DD'),
            };
          }),
          allowances: item.allowances.map((allowance) => {
            return {
              ...allowance,
              detail: allowance.detail.map((detail) => {
                return {
                  ...detail,
                  date: detail?.date != null ? moment(detail.date).format('YYYY-MM-DD') : null,
                };
              }),
            };
          }),
        };
        formData.append(`destinations[${index}]`, JSON.stringify(itemCopy));
      });

      console.log(formData, ' test');

      await Inertia.post(CREATE_API_BUSINESS_TRIP, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log(response);
      showToast('succesfully created data', 'success');
      //   onSuccess?.(true);
    } catch (e) {
      const error = e as AxiosError;

      //   onSuccess?.(false);
        console.log(error);
    }

    // console.log('values bg', values);
  };

  function setAllowancesProperty() {
    const destinationForm = [];

    const destinationCount = parseInt(totalDestination);

    for (let i = 0; i < destinationCount; i++) {
      destinationForm.push({
        destination: '',
        business_trip_start_date: new Date(),
        business_trip_end_date: new Date(),
        allowances: [],
        detail_attedances: [],
      });
    }

    // console.log(destinationForm);

    form.setValue('destinations', destinationForm);
  }

  function getUser() {}

  const {
    fields: destinationField,
    append,
    remove,
    update: updateDestination,
  } = useFieldArray({
    control: form.control,
    name: 'destinations',
  });

  React.useEffect(() => {
    if (id && type == BusinessTripType.edit) {
      getDetailData();
    }
  }, []);

  React.useEffect(() => {
    if(type == BusinessTripType.create){
        setAllowancesProperty();
    }
  }, [totalDestination, listAllowances, id, type, role, idUser]);

  const [isCashAdvance, setIsCashAdvance] = React.useState<boolean>(false);

  const handleCashAdvanceChange = (value: boolean) => {
    setIsCashAdvance(value);
  };

  // const { setValue } = useFormContext();

  // Monitor total_percent value from form
  const totalPercent = useWatch({
    control: form.control,
    name: 'total_percent',
  });

  const [totalAllowance, setTotalAllowance] = React.useState(0);

  // Assuming allowance is calculated elsewhere, let's mock it for now
  const allowance = totalAllowance; // Example: allowance is 1,000,000

  // Calculate total based on totalPercent and allowance
  React.useEffect(() => {
    const percentValue = parseFloat((totalPercent || '0').toString());
    // const percentValue = parseFloat(totalPercent || 0); // Ensure totalPercent is a number
    const total = (percentValue / 100) * allowance; // Multiply percent with allowance
    // console.log(total, ' totalll');
    form.setValue('total_cash_advance', total.toFixed(0)); // Save the total in total_cash_advance field
  }, [totalPercent, allowance]); // Recalculate when totalPercent or allowance changes

  return (
    <ScrollArea className='h-[600px] w-full '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <table className='text-xs mt-4 reimburse-form-table font-thin'>
            <tr>
              <td width={200}>Request No.</td>
              <td>ODR-YYYY-MM-XXXXXXXX</td>
            </tr>
            <tr>
              <td width={200}>Request For</td>
              <td>
                <FormField
                  control={form.control}
                  name='request_for'
                  render={({ field }) => {
                    // Jika role adalah 'user', set value default sebagai currentUserId
                    if (role === 'user' && !field.value) {
                      field.onChange(idUser.toString());
                    }
                    return (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              setSelectedUserId(value);
                              field.onChange(value);
                            }}
                            value={field.value}
                            disabled={role === 'user'} // Disable select for user role
                          >
                            <SelectTrigger className='w-[200px] py-2'>
                              <SelectValue placeholder='-- Select Business Purpose Type --' />
                            </SelectTrigger>
                            <SelectContent>
                              {role === 'admin'
                                ? users.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                      {item.name}
                                    </SelectItem>
                                  ))
                                : // If role is user, show only the logged-in user's name
                                  users
                                    .filter((user) => user.id === idUser)
                                    .map((item) => (
                                      <SelectItem key={item.id} value={item.id.toString()}>
                                        {item.name}
                                      </SelectItem>
                                    ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </td>
            </tr>
            <tr>
              <td width={200}>Bussiness Trip Purpose Type</td>
              <td>
                {' '}
                <FormField
                  control={form.control}
                  name='purpose_type_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => handlePurposeType(value)}
                          value={field.value}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-- Select Bussiness Purpose Type --' />
                          </SelectTrigger>
                          <SelectContent>
                            {listPurposeType.map((item) => (
                              <SelectItem value={item.id.toString()}>{item.name}</SelectItem>
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
            <tr>
              <td width={200}>Cost Center</td>
              <td>
                {' '}
                <FormField
                  control={form.control}
                  name='cost_center_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-- Select Cost Center --' />
                          </SelectTrigger>
                          <SelectContent>
                            {costcenter.map((item) => (
                              <SelectItem value={item.id.toString()}>{item.cost_center}</SelectItem>
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
            <tr>
              <td width={200}>Pajak</td>
              <td>
                {' '}
                <FormField
                  control={form.control}
                  name='pajak_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-- Select Pajak --' />
                          </SelectTrigger>
                          <SelectContent>
                            {pajak.map((item) => (
                              <SelectItem value={item.id.toString()}>{item.mwszkz}</SelectItem>
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
            <tr>
              <td width={200}>Purchasing Group</td>
              <td>
                {' '}
                <FormField
                  control={form.control}
                  name='purchasing_group_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-- Select Purchasing Group --' />
                          </SelectTrigger>
                          <SelectContent>
                            {purchasingGroup.map((item) => (
                              <SelectItem value={item.id.toString()}>
                                {item.purchasing_group}
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
              <td width={200}>File Attachment</td>
              <td>
                <FormField
                  control={form.control}
                  name='attachment'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs text-gray-500 font-extralight mb-1'>
                        Max File: 1000KB
                      </FormLabel>
                      <FormControl>
                        <input
                          className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                          type='file'
                          onChange={(e) => {
                            const file = e.target.files?.[0]; // Ambil file pertama
                            if (file) {
                              field.onChange(file); // Panggil onChange dengan event untuk react-hook-form
                            } else {
                              field.onChange(null); // Jika tidak ada file, set null
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
            </tr>

            <tr>
              <td width={200}>File Extension</td>
              <td className='text-gray-500 text-xs font-extralight'>doc,jpg,ods,png,txt,pdf</td>
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
                          value={field.value.toString()}
                          onValueChange={totalDestinationHandler}
                        >
                          <SelectTrigger className='w-[200px] py-2'>
                            <SelectValue placeholder='-- Select Bussiness Trip --' />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 5 }, (_, index) => (
                              <SelectItem value={(index + 1).toString()}> {index + 1} </SelectItem>
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
            listDestination={listDestination}
            form={form}
            listAllowances={listAllowances}
            totalDestination={form.getValues('total_destination').toString()}
            setTotalAllowance={setTotalAllowance}
          />

          <table className='w-full text-sm mt-10'>
            <tr>
              <td className='w-[50%]'>Cash Advance</td>
              <td className='w-[50%] pb-0'>
                <FormSwitch
                  fieldName={'cash_advance'}
                  isRequired={false}
                  disabled={false}
                  onChanges={(e) => handleCashAdvanceChange(e.target.checked)}
                />
              </td>
            </tr>
            {isCashAdvance && (
              <>
                <tr>
                  <td className='w-[50%]'>Total Percent</td>
                  <td className='w-[50%]'>
                    <FormField
                      control={form.control}
                      name='total_percent'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              // onValueChange={(value) => handlePurposeType(value)}
                              value={field.value || undefined}
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <SelectTrigger className='w-[50%] mb-2'>
                                <SelectValue placeholder='-- Select Option --' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='10'>10</SelectItem>
                                <SelectItem value='25'>25</SelectItem>
                                <SelectItem value='50'>50</SelectItem>
                              </SelectContent>
                            </Select>
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
                            <Input value={field.value || ''} readOnly={true} className='w-[50%]' />
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

          <Button type='submit'>submit</Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export function BussinesTripDestination({
  totalDestination,
  listAllowances,
  destinationField,
  form,
  updateDestination,
  setTotalAllowance,
  listDestination = [],
}: {
  totalDestination: string;
  listAllowances: AllowanceItemModel[];
  form: any;
  destinationField: any;
  updateDestination: any;
  setTotalAllowance: any;
  listDestination: DestinationModel[];
}) {
  const [startDate, setStartDate] = React.useState<Date>();

  const [endDate, setEndDate] = React.useState<Date>();

  const [selectedDestinationIdex, setDestinationIndex] = React.useState<number>(0);

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
          listDestination={listDestination}
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
  listDestination,
}: {
  form: any;
  index: number;
  destination: any;
  updateDestination: any;
  listAllowances: any;
  setTotalAllowance: any;
  listDestination: DestinationModel[];
}) {
  const {
    fields: detailAttedanceFields,
    update: updateDetailAttedances,
    append: detailAttedanceAppend,
    remove: removeAttendace,
  } = useFieldArray({
    control: form.control,
    name: `destinations.${index}.detail_attedances`,
  });

  const {
    fields: allowancesField,
    update: updateAllowance,
    append: appendAllowance,
    remove: removeAllowance,
    replace: replaceAllowance,
  } = useFieldArray({
    control: form.control,
    name: `destinations.${index}.allowances`,
  });

  //generate detail

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

      detailAttedanceAppend(object);
      momentStart = momentStart.add(1, 'days');
    }

    function generateDetailAllowanceByDate(price: string): any[] {
      let momentStart = moment(destination.business_trip_start_date).startOf('day');
      const momentEnd = moment(destination.business_trip_end_date).startOf('day');
      const detailAllowance = [];

      while (momentStart.isBefore(momentEnd) || momentStart.isSame(momentEnd)) {
        detailAllowance.push({
          date: momentStart.toDate(),
          request_price: price,
        });
        momentStart = momentStart.add(1, 'days');
      }
      return detailAllowance;
    }

    const allowancesForm = listAllowances.map((item: any) => {
      return {
        name: item.name,
        code: item.code,
        default_price: parseInt(item.grade_price),
        type: item.type,
        subtotal: parseInt(item.grade_price),
        currency: item.currency_id,
        request_value: item.request_value,
        detail:
          item.type.toLowerCase() == 'total'
            ? [
                {
                  date: null,
                  request_price: parseInt(item.grade_price),
                },
              ]
            : generateDetailAllowanceByDate(item.grade_price),
      };
    });
    replaceAllowance(allowancesForm);
  }

  function endDateHandler(value: Date | undefined) {
    updateDestination(index, {
      ...destination,
      business_trip_end_date: value,
    });
  }

  return (
    <TabsContent value={`destination${index + 1}`}>
      <div key={index}>
        <table className='text-xs mt-4 reimburse-form-detail font-thin'>
          <tr>
            <td width={200}>Destination {destination.destination}</td>
            <td>
              <FormField
                control={form.control}
                name={`destinations.${index}.destination`}
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          updateDestination(index, { ...destination, destination: value });
                        }}
                        defaultValue={destination.destination}
                        // onValueChange={(value) => field.onChange(value)}
                        // value={field.value}
                      >
                        <SelectTrigger className='w-[200px]'>
                          <SelectValue placeholder='Destination' />
                        </SelectTrigger>
                        <SelectContent>
                          {listDestination.map((map) => (
                            <SelectItem value={map.destination} className='uppercase'>
                              {map.destination}
                            </SelectItem>
                          ))}

                          {/* <SelectItem value='banyuwangi'>Banyuwangi</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </td>
          </tr>
          <tr>
            <td width={200}>Bussines Trip Date</td>
            <td className='flex space-x-2 items-center'>
              <FormField
                control={form.control}
                name={`destinations.${index}.business_trip_start_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomDatePicker
                        initialDate={destination.business_trip_start_date}
                        onDateChange={(value) => {
                          updateDestination(index, {
                            ...destination,
                            business_trip_start_date: value,
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <span>To</span>
              <FormField
                control={form.control}
                name={`destinations.${index}.business_trip_end_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomDatePicker
                        initialDate={destination.business_trip_end_date}
                        onDateChange={(value) => {
                          console.log('end date', value);
                          updateDestination(index, {
                            ...destination,
                            business_trip_end_date: value,
                          });

                          //   endDateHandler(value);
                        }}
                      />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='button' onClick={() => detailAttedancesGenerate()}>
                Get Detail
              </Button>
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
        <DetailAllowance allowanceField={allowancesField} destinationIndex={index} form={form} />
      </div>

      <ResultTotalItem
        allowanceField={allowancesField}
        destinationIndex={index}
        form={form}
        setTotalAllowance={setTotalAllowance}
      />
    </TabsContent>
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

  React.useEffect(() => {
    // Hitung ulang total allowance setiap kali allowanceField atau form berubah
    const newTotal = allowanceField.reduce((totalSum: number, allowance: any, index: number) => {
      const details = form.getValues(`destinations.${destinationIndex}.allowances.${index}.detail`);

      const itemTotal = calculateTotal(allowance, details);
      return totalSum + itemTotal;
    }, 0);

    const alldestinations = form.getValues('destinations');

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

    setGrandTotal(newTotal);
    setTotalAllowance(totalAll);
  }, [allowanceField, form.watch()]); // Menggunakan form.watch() agar memantau perubahan input
  // Fungsi untuk menghitung total per allowance
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
          {allowanceField.map((allowance: any, index: number) => (
            <ResultPerItem
              allowance={allowance}
              destinationIndex={destinationIndex}
              form={form}
              allowanceIndex={index}
            />
          ))}
        </tbody>
        <tfoot className='mt-4'>
          <tr className='font-bold'>
            <td>
              <i>Total Allowance</i>
            </td>
            <td className='flex justify-between pr-4'>
              <span>
                <i>IDR</i>
              </span>
              <span>
                <i>{grandTotal}</i>
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export function ResultPerItem({
  allowance,
  destinationIndex,
  form,
  allowanceIndex,
}: {
  allowance: any;
  destinationIndex: number;
  form: any;
  allowanceIndex: number;
}) {
  const basePrice = useWatch({
    control: form.control,
    name: `destinations.${destinationIndex}.allowances.${allowanceIndex}.detail.${0}.request_price`, // pastikan memantau field request_price
  });
  // Memantau semua detail harga jika allowance.type !== 'TOTAL'
  const details = useWatch({
    control: form.control,
    name: `destinations.${destinationIndex}.allowances.${allowanceIndex}.detail`,
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

  return (
    <tr key={allowance.id}>
      <td>{allowance.name}</td>
      <td className='flex justify-between pr-4'>
        <span>IDR</span>
        <span>{calculateTotal()}</span>
      </td>
    </tr>
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
  const detailAttedanceWatch = form.watch(`destinations.${destinationIndex}.detail_attedances`);

  React.useEffect(() => {}, [detailAttedanceWatch]);

  React.useEffect(() => {
    // console.log(detailAttedanceFields, ' Detail Attedance fields');
  }, [detailAttedanceFields]);
  return (
    <table className='text-xs mt-4 reimburse-form-detail font-thin'>
      <tr>
        <td colSpan={2}>
          <div className='mb-4 text-sm'>Detail Attedance: </div>
        </td>
      </tr>
      <tr>
        <td>
          <table className='detail-attedance text-xs'>
            <thead>
              <th>Date</th>
              <th>Shift code</th>
              <th>Shift Start</th>
              <th>Shift End</th>
              <th>Start Time</th>
              <th>End Time</th>
            </thead>
            <tbody>
              {detailAttedanceFields.map((attedance: any, index: any) => (
                <tr key={attedance.index}>
                  <td>
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

                  <td>
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
                  <td>
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
                  <td>
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
                  <td>
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.start_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input defaultValue={field.value} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td>
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.end_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input defaultValue={field.value} onChange={field.onChange} />
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
}: {
  form: any;
  destinationIndex: number;
  allowanceField: any;
}) {
  return (
    <table className='w-full allowance-table'>
      {allowanceField.map((allowance: any, index: any) => (
        <AllowanceRowInput
          form={form}
          allowance={allowance}
          destinationIndex={destinationIndex}
          allowanceIndex={index}
        />
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
  const handleClikRow = (index: number) => {
    setIsExpanded((prev) => !prev);
  };
  // Memantau base price jika allowance.type === 'TOTAL'
  const basePrice = useWatch({
    control: form.control,
    name: `destinations.${destinationIndex}.allowances.${allowanceIndex}.detail.${0}.request_price`, // pastikan memantau field request_price
  });

  // Memantau semua detail harga jika allowance.type !== 'TOTAL'
  const details = useWatch({
    control: form.control,
    name: `destinations.${destinationIndex}.allowances.${allowanceIndex}.detail`,
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

  const handleInputChange = (field: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;

    if (allowance.request_value === 'unlimited') {
      // No restrictions on input value
      field.onChange(event);
    } else if (allowance.request_value === 'up to max value') {
      if (value <= allowance.subtotal) {
        field.onChange(event);
      } else {
        alert(`Value cannot exceed the subtotal of IDR ${allowance.subtotal}`);
      }
    } else if (allowance.request_value === 'fixed value') {
      // Do not allow changes for fixed value
      alert('This value is fixed and cannot be changed.');
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
                name={`destinations.${destinationIndex}.allowances.${allowanceIndex}.detail.${0}.request_price`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input value={field.value} onChange={handleInputChange(field)} />
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
              {allowance.detail.length} Days * {allowance.subtotal} * 100%
            </span>
          )}
        </td>
        <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
          <div className='flex items-center'>
            <span className='text-sm' style={{ padding: '2px 5px' }}>
              = IDR {calculateTotal()}
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
                    name={`destinations.${destinationIndex}.allowances.${allowanceIndex}.detail.${detailIndex}.request_price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            value={field.value} // Ensure proper value binding
                            // onChange={field.onChange} // Bind change handler to form control
                            onChange={handleInputChange(field)}
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

export function AllowanceInputForm({
  form,
  type,
  allowanceIndex,
  destinationIndex,
}: {
  form: any;
  allowanceIndex: number;
  destinationIndex: number;
  type: string;
}) {
  const { fields: allowanceInput } = useFieldArray({
    control: form.control,
    name: `destinations.${destinationIndex}.allowances.${allowanceIndex}.detail`,
  });
  // console.log(allowanceInput,' allowance input nih');
  //   console.log(destinationIndex, allowanceIndex);
  return (
    <>
      {allowanceInput.map((item, index) => {
        return (
          <FormField
            control={form.control}
            name={`destinations.${destinationIndex}.allowances.${index}.detail.${index}.request_price`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </>
  );
}
// function showToast(arg0: string, arg1: string) {
//   throw new Error('Function not implemented.');
// }

// function onSuccess(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }
