import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shacdn/form';

import { z } from 'zod';

import { Inertia } from '@inertiajs/inertia';

import { Button } from '@/components/shacdn/button';
import { ChevronsUpDown } from 'lucide-react';

import { Textarea } from '@/components/shacdn/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { ScrollArea } from '@/components/shacdn/scroll-area';
import { Separator } from '@/components/shacdn/separator';
import '../css/index.scss';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';

import axiosInstance from '@/axiosInstance';
import { CustomDatePicker } from '@/components/commons/CustomDatePicker';
import {
  WorkflowApprovalDiagramInterface,
  WorkflowApprovalStepInterface,
  WorkflowComponent,
} from '@/components/commons/WorkflowComponent';
import FormSwitch from '@/components/Input/formSwitchCustom';
import { Input } from '@/components/shacdn/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shacdn/select';
import { useAlert } from '@/contexts/AlertContext';
import {
  CREATE_API_BUSINESS_TRIP,
  EDIT_API_BUSINESS_TRIP,
  GET_DETAIL_BUSINESS_TRIP,
} from '@/endpoint/business-trip/api';
import {
  GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE,
  GET_DETAIL_PURPOSE_TYPE,
} from '@/endpoint/purpose-type/api';
import { Button as ButtonMui } from '@mui/material';
import axios, { AxiosError } from 'axios';
import moment from 'moment';
import * as React from 'react';
import { DestinationModel } from '../../Destination/models/models';
import { PurposeTypeModel } from '../../PurposeType/models/models';
import {
  AllowanceItemModel,
  BusinessTripType,
  Costcenter,
  Pajak,
  PurchasingGroup,
} from '../models/models';
import { GET_LIST_DESTINATION_BY_TYPE } from '@/endpoint/destination/api';

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

interface BusinessTripAttachement {
  id: number;
  url: string;
  file_name: string;
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
// const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const BussinessTripFormV1 = ({
  users,
  listPurposeType,
  pajak,
  costcenter,
  purchasingGroup,
  type,
  id,
  isAdmin,
  idUser,
}: {
  users: User[];
  listPurposeType: PurposeTypeModel[];
  pajak: Pajak[];
  costcenter: Costcenter[];
  purchasingGroup: PurchasingGroup[];
  type: BusinessTripType;
  id: string | undefined;
  isAdmin: string | undefined;
  idUser: number | undefined;
}) => {
  const formSchema = z.object({
    purpose_type_id: z.string().min(1, 'Purpose type required'),
    request_for: z.string().min(1, 'Request is required'),
    cost_center_id: z.string().min(1, 'Cost Center is required'),
    remark: z.string().min(1, 'Remark is required'),
    attachment: z.array(
      z
        .instanceof(File)
        .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
          message: 'File type must be JPG, JPEG, PNG, or PDF',
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: 'File size must be less than 1MB',
        }),
    ),
    total_destination: z.number().min(1, 'Total Destinantion Required'),
    cash_advance: z.boolean().nullable().optional(),
    reference_number: z.string().nullable().optional(),
    total_percent: z.string().nullable().optional(),
    total_cash_advance: z.string().nullable().optional(),
    destinations: z.array(
      z.object({
        destination: z.string().min(1, 'Destinantion is Required'),
        pajak_id: z.string().min(1, 'Pajak is required'),
        purchasing_group_id: z.string().min(1, 'Purchasing Group is required'),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose_type_id: '',
      request_for: '',
      cost_center_id: '',
      remark: '',
      attachment: [],
      total_destination: 1,
      cash_advance: false,
      reference_number: '',
      total_percent: '',
      total_cash_advance: '0',
      destinations: [
        {
          detail_attedances: [],
          allowances: [],
          destination: '',
          pajak_id: '',
          purchasing_group_id: '',
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

  //   React.useEffect(() => {
  //     console.log('Form Errors:', form.formState.errors);
  //   }, [form.formState.errors]);

  const [fileAttachment, setfileAttachment] = React.useState<BusinessTripAttachement[]>([]);

  async function getDetailData() {
    const url = GET_DETAIL_BUSINESS_TRIP(id);
    //fixing data not showing in index 0
    form.setValue('destinations', []);
    try {
      const response = await axios.get(url);
      const data = response.data.data;
      //   console.log(data,' data nya');
      const getDestination = GET_LIST_DESTINATION_BY_TYPE(data.purpose_type_id);
      const responseDestination = await axiosInstance.get(getDestination);
      setListDestination(responseDestination.data.data as DestinationModel[]);
      setfileAttachment(data.attachments as BusinessTripAttachement[]);

      form.setValue('purpose_type_id', data.purpose_type_id.toString());
      form.setValue('request_for', data.request_for.id.toString());
      form.setValue('cost_center_id', data.cost_center_id.toString());
      form.setValue('remark', data.remarks);
      form.setValue('total_destination', data.total_destination);
      form.setValue('cash_advance', data.cash_advance == 1 ? true : false);
      form.setValue('reference_number', data.reference_number);
      form.setValue('total_percent', data.total_percent);
      form.setValue('total_cash_advance', data.total_cash_advance);
      form.setValue(
        'destinations',
        data.destinations.map((destination: any) => ({
          destination: destination.destination,
          pajak_id: destination.pajak_id,
          purchasing_group_id: destination.purchasing_group_id,
          //   cash_advance: destination.cash_advance == 1 ? true : false,
          //   reference_number: destination.reference_number,
          //   total_percent: destination.total_percent,
          //   total_cash_advance: destination.total_cash_advance,
          business_trip_start_date: new Date(destination.business_trip_start_date),
          business_trip_end_date: new Date(destination.business_trip_end_date),
          detail_attedances: destination.detail_attedances.map((detail: any) => {
            return {
              ...detail,
              date: new Date(detail.date),
            };
          }),
          allowances: destination.allowances.map((allowance: any) => {
            return {
              ...allowance,
              default_price: parseInt(allowance.default_price),
              subtotal: parseInt(allowance.subtotal),
              detail: allowance.detail.map((detail: any) => {
                return {
                  ...detail,
                  date: detail?.date != null ? new Date(detail.date) : null,
                };
              }),
            };
          }),
        })),
      );
    } catch (e) {
      const error = e as AxiosError;
    }
  }

  const [listAllowances, setListAllowances] = React.useState<AllowanceItemModel[]>([]);
  const [listDestination, setListDestination] = React.useState<DestinationModel[]>([]);
  const [typePurpose, setTypePurpose] = React.useState<string>('');

  const [selectedUserId, setSelectedUserId] = React.useState(
    isAdmin === '0' ? idUser.toString() : '',
  );

  async function handlePurposeType(value: string) {
    form.setValue('purpose_type_id', value || '');
    const userid = isAdmin == '0' ? idUser || '' : selectedUserId || '';
    const url = GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE(value, userid);
    const getDestination = GET_LIST_DESTINATION_BY_TYPE(value);
    const getPurposeType = GET_DETAIL_PURPOSE_TYPE(value);
    try {
      const response = await axiosInstance.get(url);
      const responseDestination = await axiosInstance.get(getDestination);
      const responsePurposeType = await axiosInstance.get(getPurposeType);
      //   console.log(responseDestination.data.data, ' responseDestination');
      //   console.log(response.data.data, ' responseresponseresponse');
      const typePurpose = responsePurposeType.data.data.purpose.type;
      if (typePurpose == 'international') {
        totalDestinationHandler('1');
      }
      setTypePurpose(typePurpose);
      setListAllowances(response.data.data as AllowanceItemModel[]);
      setListDestination(responseDestination.data.data as DestinationModel[]);
    } catch (e) {
      console.log(e);
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
    // console.log(values, ' valuesss');
    try {
      const formData = new FormData();
      const totalAll = getTotalDes();
      // Append group data
      formData.append('user_id', values.request_for ?? '');
      formData.append('value', totalAll.toString());

      formData.append('purpose_type_id', values.purpose_type_id ?? '');
      formData.append('request_for', values.request_for ?? '');
      formData.append('cost_center_id', values.cost_center_id ?? '');
      formData.append('remark', values.remark ?? '');
      formData.append('reference_number', `${values.reference_number}`);
      formData.append('cash_advance', `${values.cash_advance}`);
      formData.append('total_percent', `${values.total_percent}`);
      formData.append('total_cash_advance', `${values.total_cash_advance}`);

      values.attachment.forEach((file: any, index: number) => {
        if (file) {
          formData.append(`attachment[${index}]`, file);
        }
      });
      formData.append('total_destination', `${values.total_destination}`);
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

      if (type == BusinessTripType.create) {
        await Inertia.post(CREATE_API_BUSINESS_TRIP, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showToast('succesfully created data', 'success');
      } else {
        await Inertia.post(`${EDIT_API_BUSINESS_TRIP}/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showToast('succesfully updated data', 'success');
      }

      // console.log(response);
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
        pajak_id: '',
        purchasing_group_id: '',
        cash_advance: false,
        total_percent: '',
        total_cash_advance: '0',
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
    console.log(BusinessTripType.edit, ' business edit');
    console.log(type, ' id type');
    if (id && type == BusinessTripType.edit) {
      getDetailData();
    }
  }, []);

  React.useEffect(() => {
    if (type == BusinessTripType.create) {
      setAllowancesProperty();
    }
  }, [totalDestination, listAllowances, id, type, isAdmin, idUser]);

  const [isShow, setIsShow] = React.useState(false);
  const [approvalRoute, setApprovalRoute] = React.useState({
    approvalRequest: [],
    approvalFrom: [],
    acknowledgeFrom: [],
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

    return totalAll;
  };

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
          user_id: form.getValues('request_for'),
          type: 'TRIP',
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

        const dataApproval = {
          approvalRequest,
          approvalFrom,
          acknowledgeFrom: acknowledgeFrom,
        };
        setApprovalRoute(dataApproval);
        setIsShow(true);
      }
    } catch (error) {
      showToast(error?.response?.data?.message, 'error');
    }
  };

  React.useEffect(() => {
    const totalAll = getTotalDes();
    if (totalAll > 0) {
      fetchDataValue();
    }
    // console.log(listDestination, ' get value');
  }, [form.watch('destinations')]);

  const [deletedFiles, setDeletedFiles] = React.useState<number[]>([]); // Simpan index file yang dihapus

  // Menandai file untuk dihapus
  const handleDelete = (id: number) => {
    setfileAttachment((prev) => prev.filter((file) => file.id !== id));
  };

  const [isCashAdvance, setIsCashAdvance] = React.useState<boolean>(false);

  const handleCashAdvanceChange = (value: boolean) => {
    setIsCashAdvance(value);
  };

  const totalPercent: any = useWatch({
    control: form.control,
    name: `total_percent`,
  });

  const [totalAllowance, setTotalAllowance] = React.useState(0);
  // Assuming allowance is calculated elsewhere, let's mock it for now
  const allowance = totalAllowance;

  //   // Calculate total based on totalPercent and allowance
  React.useEffect(() => {
    // console.log(form.getValues('destinations'), ' edit destination');
    if (type == BusinessTripType.edit) {
      setIsCashAdvance(form.getValues(`cash_advance`) ?? false);
    }
    const percentValue = parseFloat((totalPercent || '0').toString());
    // const percentValue = parseFloat(totalPercent || 0); // Ensure totalPercent is a number
    const total = (percentValue / 100) * allowance; // Multiply percent with allowance
    // console.log(total, ' totalll');
    form.setValue(`total_cash_advance`, total.toFixed(0)); // Save the total in total_cash_advance field
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
                    if (isAdmin === '0' && !field.value) {
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
                            disabled={isAdmin === '0'} // Disable select for user role
                          >
                            <SelectTrigger className='w-[200px] py-2'>
                              <SelectValue placeholder='-- Select Business Purpose Type --' />
                            </SelectTrigger>
                            <SelectContent>
                              {isAdmin === '1'
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
                              <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name}
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
                              <SelectItem key={item.id} value={item.id.toString()}>
                                {item.cost_center}
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
                          multiple // Menambahkan atribut multiple
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
                      {form.formState.errors.attachment &&
                      Array.isArray(form.formState.errors.attachment)
                        ? form.formState.errors.attachment.map((error, index) => (
                            <p key={index} className='text-[0.8rem] font-medium text-destructive'>
                              {error.message}
                            </p>
                          ))
                        : null}
                    </FormItem>
                  )}
                />
              </td>
            </tr>
            {fileAttachment.length > 0 && (
              <tr>
                <td width={200}></td>
                {fileAttachment.map((attachment: any, index: number) => (
                  <td className='flex flex-col pb-3'>
                    <a
                      href={attachment.url}
                      target='_blank'
                      className='text-blue-500 inline-block'
                      key={index}
                    >
                      {attachment.file_name}
                    </a>
                    <button
                      type='button'
                      onClick={() => handleDelete(attachment.id)}
                      className='text-red-500 mt-2'
                    >
                      Delete
                    </button>
                  </td>
                ))}
              </tr>
            )}
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
                          disabled={typePurpose === 'international'}
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
            listDestination={listDestination}
            form={form}
            listAllowances={listAllowances}
            totalDestination={form.getValues('total_destination').toString()}
            pajak={pajak}
            purchasingGroup={purchasingGroup}
            setTotalAllowance={setTotalAllowance}
          />
          <Separator className='my-4' />

          {/* CASH ADVANCE */}
          <table className='w-full text-sm mt-10'>
            <tr>
              <td className='w-[50%]'>Cash Advance</td>
              <td className='w-[50%] pb-0'>
                <FormSwitch
                  fieldName={`cash_advance`}
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
                      name={`reference_number`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value)}
                              className='w-[50%] mb-2'
                              placeholder='Reference Number'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`total_percent`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              // onValueChange={(value) => handlePurposeType(value)}
                              value={field.value || undefined}
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <SelectTrigger className='w-[50%] mb-2'>
                                <SelectValue placeholder='-- Select Total Percent --' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='10'>10%</SelectItem>
                                <SelectItem value='25'>25%</SelectItem>
                                <SelectItem value='50'>50%</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`total_cash_advance`}
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
                  approvalRoute.approvalFrom as unknown as WorkflowApprovalStepInterface
                }
                workflowApprovalDiagram={
                  approvalRoute.approvalFrom as unknown as WorkflowApprovalDiagramInterface
                }
              />
            )}
          </div>
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
  pajak,
  purchasingGroup,
  typeEdit,
}: {
  totalDestination: string;
  listAllowances: AllowanceItemModel[];
  form: any;
  destinationField: any;
  updateDestination: any;
  setTotalAllowance: any;
  listDestination: DestinationModel[];
  pajak: Pajak[];
  purchasingGroup: PurchasingGroup[];
  typeEdit: any;
}) {
  const [startDate, setStartDate] = React.useState<Date>();

  const [endDate, setEndDate] = React.useState<Date>();

  const [selectedDestinationIdex, setDestinationIndex] = React.useState<number>(0);

  const { showToast } = useAlert();

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
          pajak={pajak}
          purchasingGroup={purchasingGroup}
          typeEdit={typeEdit}
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
  pajak,
  purchasingGroup,
  typeEdit,
}: {
  form: any;
  index: number;
  destination: any;
  updateDestination: any;
  listAllowances: any;
  setTotalAllowance: any;
  listDestination: DestinationModel[];
  pajak: Pajak[];
  purchasingGroup: PurchasingGroup[];
  typeEdit: any;
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

  //   console.log(listDestination, 'listDestination 123');
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
            <td width={200}>Pajak</td>
            <td>
              {' '}
              <FormField
                control={form.control}
                name={`destinations.${index}.pajak_id`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          updateDestination(index, { ...destination, pajak_id: value });
                        }}
                        defaultValue={destination.pajak_id}
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
                name={`destinations.${index}.purchasing_group_id`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          updateDestination(index, { ...destination, purchasing_group_id: value });
                        }}
                        defaultValue={destination.purchasing_group_id}
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
