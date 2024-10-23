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
import { AllowanceItemModel, BusinessTripType } from '../models/models';
import { Item } from '@radix-ui/react-dropdown-menu';
import Detail from '@/Pages/User/Api/Detail';
import { AllowanceForm } from '../../AllowanceCategory/components/AllowaceForm';
import axios, { AxiosError } from 'axios';
import { CREATE_API_BUSINESS_TRIP, GET_DETAIL_BUSINESS_TRIP } from '@/endpoint/business-trip/api';
import FormSwitch from '@/components/Input/formSwitchCustom';
import FormAutocomplete from '@/components/Input/formDropdown';

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
  type,
  id,
  role,
  idUser,
}: {
  users: User[];
  listPurposeType: PurposeTypeModel[];
  type: BusinessTripType;
  id: string;
  role: string;
  idUser: string;
}) => {
  const formSchema = z.object({
    purpose_type_id: z.string().min(1, 'Purpose type required'),
    request_for: z.string().min(1, 'Request for required'),
    remark: z.string().min(1, 'Remark is required'),
    attachment: z.instanceof(File).nullable().optional(),
    total_destination: z.number().min(1, 'Total Destinantion Required'),
    cash_advance: z.boolean().nullable().optional(),
    total_percent: z.string().nullable().optional(),
    total_cash_advance: z.string().nullable().optional(),
    destinations: z.array(
      z.object({
        destination: z.string().optional(),
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
                date: z.date().optional(),
                request_price: z.any().optional(),
              }),
            ),
          }),
        ),
      }),
    ),
  });
  const [totalDestination, setTotalDestination] = React.useState<string>('1');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose_type_id: '',
      request_for: '',
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

  async function getDetailData() {
    let url = GET_DETAIL_BUSINESS_TRIP(id);

    try {
      let response = await axios.get(url);
      console.log(response, ' Response Detail');

      //   const allowance = {
      //     name: item.name,
      //     code: item.code,
      //     default_price: item.grade_all_price,
      //     type: item.type,
      //     subtotal: item.grade_all_price,
      //     currency: item.currency_id,
      //     request_value: item.request_value,
      //     detail:
      //       item.type == 'total'
      //         ? [
      //             {
      //               date: undefined,
      //               request_price: item.grade_all_price,
      //             },
      //           ]
      //         : detailAllowance,
      //   };

      form.reset({
        purpose_type_id: response.data.data.purpose_type_id,
        request_for: response.data.data.request_for,
        remark: response.data.data.remarks,
        attachment: null,
        total_destination: response.data.data.total_destination,
        destinations: [
          {
            detail_attedances: response.data.data.destination.detail_attedances,
            allowances: [],
            destination: response.data.data.destination.destination,
            business_trip_start_date: new Date(),
            business_trip_end_date: new Date(),
          },
        ],
      });
    } catch (e) {
      let error = e as AxiosError;
    }
  }

  const [listAllowances, setListAllowances] = React.useState<AllowanceItemModel[]>([]);

  async function handlePurposeType(value: string) {
    form.setValue('purpose_type_id', value || '');
    let userid = idUser || '';
    // console.log(value);
    let url = GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE(value, userid);

    try {
      let response = await axiosInstance.get(url);

      console.log(response.data);
      setListAllowances(response.data.data as AllowanceItemModel[]);
    } catch (e) {
      console.log(e);
    }
  }

  const totalDestinationHandler = (value: string) => {
    let valueToInt = parseInt(value);
    setTotalDestination(value);
    setAllowancesProperty();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values, ' test');
    try {
      const formData = new FormData();
      // Append group data
      formData.append('purpose_type_id', values.purpose_type_id ?? '');
      formData.append('request_for', values.request_for ?? '');
      formData.append('remark', values.remark ?? '');
      formData.append('attachment', values.attachment ?? '');
      formData.append('total_destination', `${values.total_destination}`);
      formData.append('cash_advance', `${values.cash_advance}`);
      formData.append('total_percent', `${values.total_percent}`);
      formData.append('total_cash_advance', `${values.total_cash_advance}`);
      values.destinations.forEach((item) => {
        formData.append('destinations', JSON.stringify(item));
      });

      // const response = axios.post(CREATE_API_BUSINESS_TRIP, formData);

      await Inertia.post(CREATE_API_BUSINESS_TRIP, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log(response);
      showToast('succesfully created data', 'success');
      onSuccess?.(true);
    } catch (e) {
      const error = e as AxiosError;

      onSuccess?.(false);
      console.log(error);
    }

    console.log('values bg', values);
  };

  function setAllowancesProperty() {
    let destinationForm = [];

    let destinationCount = parseInt(totalDestination);

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
    setAllowancesProperty();
    if (id && type == BusinessTripType.edit) {
      getDetailData();
    }
  }, [totalDestination, listAllowances, id, type, role, idUser]);
  return (
    <ScrollArea className='h-[600px] w-full '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <table className='text-xs mt-4 reimburse-form-table font-thin'>
            <tr>
              <td width={200}>Request No.</td>
              <td>Test-12321</td>
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
                            onValueChange={(value) => field.onChange(value)}
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
                        <Select value={totalDestination} onValueChange={totalDestinationHandler}>
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
            form={form}
            listAllowances={listAllowances}
            totalDestination={form.getValues('total_destination').toString()}
          />

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
}: {
  totalDestination: string;
  listAllowances: AllowanceItemModel[];
  form: any;
  destinationField: any;
  updateDestination: any;
}) {
  const [startDate, setStartDate] = React.useState<Date>();

  const [endDate, setEndDate] = React.useState<Date>();

  const [selectedDestinationIdex, setDestinationIndex] = React.useState<number>(0);
  console.log(destinationField, ' Destination Field');
  return (
    <Tabs defaultValue='destination1' className='w-full'>
      <TabsList className={`flex items-center justify-start space-x-4`}>
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
}: {
  form: any;
  index: number;
  destination: any;
  updateDestination: any;
  listAllowances: any;
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
    let momentStart = moment(destination.business_trip_start_date);
    let momentEnd = moment(destination.business_trip_end_date);
    removeAttendace();
    removeAllowance();

    let detailAllowance = [];

    while (momentStart.format('DD/MM/YYYY') <= momentEnd.format('DD/MM/YYYY')) {
      const object = {
        date: momentStart.toDate(),
        shift_code: 'SHIFTREGULAR',
        shift_start: '08:00',
        shift_end: '17:00',
        end_time: '17:00',
        start_time: '08:00',
      };

      detailAllowance.push({
        date: momentStart.toDate(),
        request_price: 0,
      });

      momentStart = momentStart.add(1, 'days');
      detailAttedanceAppend(object);
    }
    // console.log(listAllowances, ' allowance');
    let allowancesForm = listAllowances.map((item: any) => {
      return {
        name: item.name,
        code: item.code,
        default_price: item.grade_all_price,
        type: item.type,
        subtotal: item.grade_all_price,
        currency: item.currency_id,
        request_value: item.request_value,
        detail:
          item.type == 'total'
            ? [
                {
                  date: undefined,
                  request_price: item.grade_all_price,
                },
              ]
            : detailAllowance,
      };
    });

    replaceAllowance(allowancesForm);

    console.log(allowancesForm, ' Formmm');
    // console.log('destination',destination)
  }

  function endDateHandler(value: Date | undefined) {
    updateDestination(index, {
      ...destination,
      business_trip_end_date: value,
    });
  }

  const [isCashAdvance, setIsCashAdvance] = React.useState<boolean>(false);

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
  const allowance = 1000000; // Example: allowance is 1,000,000

  // Calculate total based on totalPercent and allowance
  React.useEffect(() => {
    const percentValue = parseFloat(totalPercent || 0); // Ensure totalPercent is a number
    const total = (percentValue / 100) * allowance; // Multiply percent with allowance
    setValue('total_cash_advance', total.toFixed(2)); // Save the total in total_cash_advance field
  }, [totalPercent, allowance, setValue]); // Recalculate when totalPercent or allowance changes

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
                        // value={field.value}
                      >
                        <SelectTrigger className='w-[200px]'>
                          <SelectValue placeholder='Destination' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='jakarta'>Jakarta</SelectItem>
                          <SelectItem value='banyuwangi'>Banyuwangi</SelectItem>
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
                          //   updateDestination(index, {
                          //     ...destination,
                          //     business_trip_end_date: value,
                          //   });

                          endDateHandler(value);
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
        <table className='w-full text-sm mt-10'>
          <tr>
            <td className='w-[20%]'>Cash Advance</td>
            <td className='w-[80%] flex'>
              <FormSwitch
                fieldName={'cash_advance'}
                isRequired={false}
                disabled={false}
                onChanges={(e) => handleCashAdvanceChange(e.target.checked)}
              />
              {isCashAdvance && (
                <>
                  <FormField
                    control={form.control}
                    name='total_percent'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            // onValueChange={(value) => handlePurposeType(value)}
                            value={field.value || ''}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className='w-[200px]'>
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
                          <Input value={field.value || ''} disabled={true} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </td>
          </tr>
        </table>
      </div>
      {/* disini */}
      <ResultTotalItem allowanceField={allowancesField} />
    </TabsContent>
  );
}

export function ResultTotalItem({ allowanceField }: { allowanceField: any }) {
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
            <tr key={allowance.id}>
              <td>{allowance.name}</td>
              <td className='flex justify-between pr-4'>
                <span>IDR</span>
                <span></span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className='mt-4'>
          <tr>
            <td>
              <i>Total Allowance</i>
            </td>
            <td className='flex justify-between pr-4'>
              <span>IDR</span>
              <span></span>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
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
    console.log(detailAttedanceFields, ' Detail Attedance fields');
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
      alert(`This value is fixed and cannot be changed.`);
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
                            disabled={allowance.request_value === 'fixed value'}
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
function showToast(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}

function onSuccess(arg0: boolean) {
  throw new Error('Function not implemented.');
}
