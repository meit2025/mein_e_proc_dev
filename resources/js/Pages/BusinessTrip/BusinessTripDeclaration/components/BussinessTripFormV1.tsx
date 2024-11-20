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
  GET_DETAIL_BUSINESS_TRIP_DECLARATION,
} from '@/endpoint/business-trip-declaration/api';
import { AllowanceItemModel, BusinessTripModel } from '../models/models';
import axiosInstance from '@/axiosInstance';
import moment from 'moment';
import FormSwitch from '@/components/Input/formSwitchCustom';
import { Button } from '@/components/shacdn/button';
import { ChevronsUpDown, Plus, UndoIcon, X } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { Inertia } from '@inertiajs/inertia';
import { useAlert } from '@/contexts/AlertContext';

interface Props {
  listBusinessTrip: BusinessTripModel[];
}

export const BussinessTripFormV1 = ({
  listBusinessTrip,
}: {
  listBusinessTrip: BusinessTripModel[];
}) => {
  const formSchema = z.object({
    request_no: z.string().nonempty('Request for required'),
    remark: z.string().nonempty('Remark is required'),
    attachment: z.instanceof(File).nullable().optional(),
    total_destination: z.number().int('Total Destinantion Required'),
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
                request_price: z.string().optional(),
              }),
            ),
          }),
        ),
        other: z.array(
            z.object({
              value: z.number().optional(),
            })
          ),
      }),
    ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request_no: '',
      remark: '',
      attachment: null,
      total_destination: 1,
      destinations: [
        {
          destination: '',
          business_trip_start_date: new Date(),
          business_trip_end_date: new Date(),
          detail_attedances: [],
          allowances: [],
          other: [
            {value: 0}
          ]
        },
      ],
    },
  });

  const { showToast } = useAlert();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values, ' valuesnya');
    try {
      const formData = new FormData();
      // Append group data
      formData.append('request_no', values.request_no ?? '');
      formData.append('remark', values.remark ?? '');
      formData.append('attachment', values.attachment ?? '');
      formData.append('total_destination', `${values.total_destination}`);
      values.destinations.forEach((item, index) => {
        formData.append(`destinations[${index}]`, JSON.stringify(item));
      });

      // const response = axios.post(CREATE_API_BUSINESS_TRIP, formData);

      await Inertia.post(CREATE_API_BUSINESS_TRIP_DECLARATION, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast('succesfully created data', 'success');
    } catch (e) {
      const error = e as AxiosError;

      console.log(error);
    }
  };

  const [businessTripDetail, setBusinessTripDetail] = React.useState<BusinessTripModel>([]);

  const [listAllowances, setListAllowances] = React.useState<AllowanceItemModel[]>([]);
  const [listDestination, setListDestination] = React.useState<[]>([]);

  async function handleGetBusinessTrip(value: string) {
    form.setValue('request_no', value || '');
    const url = GET_DETAIL_BUSINESS_TRIP_DECLARATION(value);

    try {
      const response = await axiosInstance.get(url);
      const businessTripData = response.data.data;
      console.log(businessTripData, ' Response Detail Business Trip');
      form.setValue('remark', businessTripData.remarks || '');
      form.setValue('total_destination', businessTripData.total_destination || 1);

      //   form.setValue('attachment', businessTripData.attachment || null);
      //   form.setValue('cash_advance', businessTripData.cash_advance || false);
      //   form.setValue('total_percent', businessTripData.total_percent || '0');
      //   form.setValue('total_cash_advance', businessTripData.total_cash_advance || '0');
      //   form.setValue('destinations', businessTripData.total_cash_advance || '0');

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
  console.log(businessTripDetail, 'businessTripDetail');

  function setAllowancesProperty(destinations: any[]) {
    const destinationForm = destinations.map((destination) => ({
      destination: destination.destination || '', // Adjust field names as needed
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
                <FormField
                  control={form.control}
                  name='request_no'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => handleGetBusinessTrip(value)}
                          value={field.value}
                        >
                          <SelectTrigger className='w-[200px] py-2'>
                            <SelectValue placeholder='-- Select One --' />
                          </SelectTrigger>
                          <SelectContent>
                            {listBusinessTrip.map((item:any) => (
                              <SelectItem value={item.id.toString()}>{item.request_no}</SelectItem>
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
                  <td width={200}>Pajak</td>
                  <td className='text-sm'>{businessTripDetail?.pajak?.mwszkz}</td>
                </tr>
                <tr>
                  <td width={200}>Cost Center</td>
                  <td className='text-sm'>{businessTripDetail?.cost_center?.company_code}</td>
                </tr>
                <tr>
                  <td width={200}>Purchasing Group</td>
                  <td className='text-sm'>
                    {businessTripDetail?.purchasing_group?.purchasing_group}
                  </td>
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
              <td className='text-gray-500 text-xs font-extralight'>Not Availabe</td>
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
                        <Select value={totalDestination} onValueChange={totalDestinationHandler} disabled={true}>
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
            setTotalAllowance={setTotalAllowance}
            businessTripDetail={businessTripDetail}
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
  form,
  destinationField,
  updateDestination,
  setTotalAllowance,
  businessTripDetail,
}: {
  totalDestination: string;
  listAllowances: AllowanceItemModel[];
  form: any;
  destinationField: any;
  updateDestination: any;
  setTotalAllowance: any;
  businessTripDetail: any;
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
}: {
  form: any;
  index: number;
  destination: any;
  updateDestination: any;
  listAllowances: any;
  setTotalAllowance: any;
  businessTripDetail: any;
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
  const allowance = businessTripDetail.total_cash_advance; // Example: allowance is 1,000,000

  // Calculate total based on totalPercent and allowance
  React.useEffect(() => {
    const percentValue = parseFloat(totalPercent || 0); // Ensure totalPercent is a number
    const total = (percentValue / 100) * allowance; // Multiply percent with allowance
    setValue('total_cash_advance', total.toFixed(2)); // Save the total in total_cash_advance field
  }, [totalPercent, allowance, setValue]); // Recalculate when totalPercent or allowance changes
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
        <DetailAllowance allowanceField={allowancesField} destinationIndex={index} form={form} />
      </div>
      {/* disini */}
      {/* <ResultTotalItem
        allowanceField={allowancesField}
        destinationIndex={index}
        form={form}
        setTotalAllowance={setTotalAllowance}
      /> */}

      <table className='w-full text-sm mt-10'>
        <tr>
          <td className='w-[20%]'>Cash Advance</td>
          <td className='w-[80%] flex'>{allowance}</td>
        </tr>
      </table>
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
  const resultItem = form.watch(`destinations[${destinationIndex}].allowances`);
  const totalItem = form.watch(`destinations[${destinationIndex}].total_allowance`);
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
                <span>{allowance.subtotal}</span>
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
              <span>{totalItem}</span>
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
  const detailAttedanceWatch = form.watch(`destinations[${destinationIndex}].detail_attedances`);
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
        <td className='overflow-x'>
          <table className='detail-attedance text-xs table-auto overflow-scroll w-full'>
            <thead>
              <th>Date</th>
              <th>Shift code</th>
              <th>Shift Start</th>
              <th>Shift End</th>
              <th>Request Start Time</th>
              <th>Request End Time</th>
              <th>Start Time</th>
              <th>End Time</th>
            </thead>
            <tbody>
              {detailAttedanceWatch.map((attedance: any, index: any) => (
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
                  <td>
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.request_start_time`}
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
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.request_end_time`}
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
  const detailAllowanceceWatch = form.watch(`destinations[${destinationIndex}].allowances`);
console.log('detailAllowanceceWatch', detailAllowanceceWatch)
  React.useEffect(() => {}, [detailAllowanceceWatch]);

  // Field array untuk menyimpan other allowances
  const { fields: otherAllowances, append, remove } = useFieldArray({
    control: form.control,
    name: `destinations.${destinationIndex}.other`, // Path field array
  });

  const watchedAllowances = useWatch({
    control: form.control,
    name: `destinations.${destinationIndex}.other`, // Mengawasi perubahan nilai
  });

  const calculateTotalOther = () => {
    return (watchedAllowances || []).reduce((total:number, allowance:any) => {
      const allowanceValue = Number(allowance?.value || 0);
      return total + allowanceValue;
    }, 0);
  };

  const addOtherAllowance = () => {
    append({value:0}); // Tambahkan field baru ke array
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
                      type="number"
                      value={field.value ?? ''} // Gunakan string kosong jika nilai null/undefined
                      onChange={(e) => {
                        const parsedValue = e.target.value === '' ? undefined : Number(e.target.value); // Konversi ke angka atau undefined
                        field.onChange(parsedValue); // Serahkan nilai yang sudah dikonversi
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
                = IDR {calculateTotalOther()}
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
        const fixedValue = allowance.subtotal; // Example fixed value, change as needed
        if (requestPrice !== fixedValue) {
          alert(`Please enter the fixed value of IDR ${fixedValue}`);
          isValid = false;
        }
        break;

      case 'up to max value':
        // Set a maximum value limit
        const maxValue = allowance.subtotal; // Example max value, change as needed
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
              {allowance.detail.length} Days * {allowance.subtotal} * 100%
            </span>
          )}
        </td>
        <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
          <div className='flex items-center'>
            <span className='text-sm total' style={{ padding: '2px 5px' }}>
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
