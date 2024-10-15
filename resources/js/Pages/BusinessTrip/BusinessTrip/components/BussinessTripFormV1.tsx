import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
  } from '@/components/shacdn/form';

  import { z } from 'zod';

  import { Button } from '@/components/shacdn/button';
  import { ChevronsUpDown, Plus, UndoIcon, X } from 'lucide-react';

  import { zodResolver } from '@hookform/resolvers/zod';
  import { FieldArray, FieldArrayWithId, useFieldArray, useForm, useWatch } from 'react-hook-form';
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
  import { AllowanceItemModel } from '../models/models';
  import { Item } from '@radix-ui/react-dropdown-menu';
  import Detail from '@/Pages/User/Api/Detail';
  import { AllowanceForm } from '../../AllowanceCategory/components/AllowaceForm';

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
  }: {
    users: User[];
    listPurposeType: PurposeTypeModel[];
  }) => {
    const formSchema = z.object({
      purpose_type_id: z.string().min(1, 'Purpose type required'),
      request_for: z.string().min(1, 'Request for required'),
      remark: z.string().optional(),
      attachment: z
        .any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          'Only .jpg, .jpeg, .png and .webp formats are supported.',
        )
        .optional(),
      total_destination: z.number().min(1, 'Total Destinantion Required'),
      destinations: z.array(
        z.object({
          destination: z.string().optional(),
          business_trip_start_date: z.date().optional(),
          business_trip_end_date: z.date().optional(),
          detail_attedances: z.array(
            z.object({
              date: z.date().optional(),
              shift_code: z.string().optional(),
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
        // attachment: null,
        total_destination: 1,
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

    const [listAllowances, setListAllowances] = React.useState<AllowanceItemModel[]>([]);

    async function handlePurposeType(value: string) {
      form.setValue('purpose_type_id', value || '');
      // console.log(value);
      let url = GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE(value);

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

    const onSubmit = (values: z.infer<typeof formSchema>) => {
      // try {
      //   const response = axios.post(CREATE_API_ALLOWANCE_CATEGORY, values);

      //   console.log(response);
      //   showToast('succesfully created data', 'success');
      //   onSuccess?.(true);
      // } catch (e) {
      //   const error = e as AxiosError;

      //   onSuccess?.(false);
      //   console.log(error);
      // }

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
    }, [totalDestination, listAllowances]);
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
                <td width={200}>Request For </td>
                <td>
                  {' '}
                  <FormField
                    control={form.control}
                    name='request_for'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                          >
                            <SelectTrigger className='w-[200px] py-2'>
                              <SelectValue placeholder='-- Select Bussiness Purpose Type --' />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((item) => (
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
                          <Input type='file' {...field} />
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

      console.log(momentStart.format('DD/MM/YYYY'));
      console.log(momentEnd.format('DD/MM/YYYY'));

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
          request_price: 800,

        });

        momentStart = momentStart.add(1, 'days');
        detailAttedanceAppend(object);
      }

      let allowancesForm = listAllowances.map((item:any) => {
          return {
              name: item.name,
              code: item.code,
              default_price: dummyPrice,
              type: item.type,
              subtotal: dummyPrice,
              currency: item.currency_id,
              detail:
              item.type == 'TOTAL'
                  ? [
                      {
                      date: undefined,
                      request_price: dummyPrice,
                      },
                  ]
                  :
                  detailAllowance,
          };
      });

      replaceAllowance(allowancesForm);

      // console.log(allowancesField);
      // console.log('destination',destination)
    }

    function endDateHandler(value: Date | undefined) {
      updateDestination(index, {
        ...destination,
        business_trip_end_date: value,
      });
    }

    return (
      <TabsContent value={`destination${index + 1}`}>
        <div>
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
              <td width={200}>
                Bussines Trip Date
                {moment(destination.business_trip_start_date).format('DD-MM-YYYY')}
                {moment(destination.business_trip_end_date).format('DD-MM-YYYY')}
              </td>
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

            {/*
                {field.allowances.map((allowances, allowanceIndex) => (
                  <tr>
                    <td width={300}>{allowances.name}</td>
                    <td>
                      <FormField
                        control={form.control}
                        name={`destinations.${index}.allowances.${allowanceIndex}.`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                  </tr>
                ))} */}

            {/* <tr>
                      <td width={300}>Dinner Sector A Domestic</td>
                      <td>3 Day(s)* 25000 * 100 = IDR 750000</td>
                    </tr>
                    <tr>
                      <td width={300}>Lunch Sector A Domestic</td>
                      <td>3 Day(s)* 25000 * 100 = IDR 750000</td>
                    </tr>
                    <tr>
                      <td width={300}>Pocket Money Allowance Sector A Domestic</td>
                      <td>3 Day(s)* 25000 * 100 = IDR 750000</td>
                    </tr> */}
          </table>


          <DetailAllowance allowanceField={allowancesField} destinationIndex={index} form={form} />

          {/* <table className='w-3/4 detail-bussiness text-xs text-gray-600 font-light'>
            <thead>
              <th>Item</th>
              <th className='text-right'>SubTotal</th>
            </thead>

            <tbody> */}
              {/* {field.allowances.map((allowances, allowanceIndex) => (
                    <tr>
                      <td width={300}>{allowances.name}</td>
                      <td>
                        <FormField
                          control={form.control}
                          name={`destinations.${index}.allowances.${allowanceIndex}.default_price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>

                                {form.getValues(
                                  `destinations.${index}.allowances.${allowanceIndex}.default_price`,
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                    </tr>
                  ))} */}

              {/* <tr>
                <td width={'50%'} className='flex justify-between pt-8 items-center'>
                  <span className='italic text-sm'>Total Allowance</span>
                  <span>IDR</span>
                </td>
                <td className='text-right pt-8'>
                  <span>70.000</span>
                </td>
              </tr>
            </tbody>
          </table> */}
        </div>
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
    const detailAttedanceWatch = form.watch(`destinations.${destinationIndex}.detail_attedances`);

    React.useEffect(() => {}, [detailAttedanceWatch]);

    React.useEffect(() => {
      console.log(detailAttedanceFields);
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
                {detailAttedanceFields.map((attedance:any, index:any) => (
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
    allowanceIndex:number;
  }) {

    return (
      <table className='w-full allowance-table'>
        {allowanceField.map((allowance:any, index:any) => (
          <AllowanceRowInput form={form} allowance={allowance} index={index} destinationIndex={destinationIndex} allowanceIndex={index}/>
        ))}
      </table>
    );
  }


  export function AllowanceRowInput({ form, allowance, index, destinationIndex,  allowanceIndex }: { form: any, allowance: any, index:number,destinationIndex: any, allowanceIndex: any }) {
      const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
      const handleClikRow = (index:number) => {
          setIsExpanded((prev) => !prev);
      }
      // Memantau base price jika allowance.type === 'TOTAL'
      const basePrice = useWatch({
          control: form.control,
          name: `destinations.${destinationIndex}.allowances.${allowanceIndex}.detail.${index}.request_price`, // pastikan memantau field request_price
      });

      // Memantau semua detail harga jika allowance.type !== 'TOTAL'
      const details = useWatch({
          control: form.control,
          name: `destinations.${destinationIndex}.allowances.${allowanceIndex}.detail`,
      });

      const calculateTotal = () => {
          if (allowance.type === 'TOTAL') {
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
        <>
          <tr key={allowance.id}>
            <td width={260} style={{ verticalAlign: 'middle' }} className='text-sm'>
              {allowance.name} {index}
            </td>
            <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>:</td>
            <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
              {allowance.type == 'TOTAL' ? <span className='text-sm'>IDR</span> : <span></span>}
            </td>
            <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
              {allowance.type == 'TOTAL' ? (
                <div className='flex items-center'>
                  <AllowanceInputForm
                    form={form}
                    allowanceIndex={index}
                    type={allowance.type}
                    destinationIndex={destinationIndex}
                  />
                  <span className='text-sm'>* 100%</span>
                </div>
              ) : (
                <span className='text-sm'> {allowance.detail.length} Days * 0 * 100%</span>
              )}
            </td>
            <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
              <div className='flex items-center'>
                <span className='text-sm' style={{ padding: '2px 5px' }}>
                  = IDR {calculateTotal()}
                </span>
              </div>
            </td>
            {allowance.type == 'DAY' ? (
              <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}></td>
            ) : (
              <td
                style={{ verticalAlign: 'middle', padding: '2px 5px' }}
                onClick={() => handleClikRow(index)}
              >
                <Button variant='ghost' size='sm' className='w-9 p-0'>
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
                    {detailIndex}
                  </td>
                  <td style={{ padding: '8px 2px', verticalAlign: 'middle' }}>:</td>
                  <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
                    <span className='text-sm'>IDR</span>
                  </td>
                  <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
                    <div className='flex mt-1 text-sm justify-between items-center'>
                      <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.allowances.${index}.detail.${detailIndex}.request_price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                value={field.value} // Ensure proper value binding
                                onChange={field.onChange} // Bind change handler to form control
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {detail.request_price}
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
    console.log(allowanceInput,' allowance input nih');
  //   console.log(destinationIndex, allowanceIndex);
    return (
      <>
        {allowanceInput.map((item, index) => {
            return (
                <FormField
                control={form.control}
                name={`destinations.${destinationIndex}.allowances.${allowanceIndex}.detail.${index}.request_price`}
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Input value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
                />
            )
        })}
      </>
    );
  }
