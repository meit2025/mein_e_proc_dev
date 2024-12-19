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
import useDropdownOptions from '@/lib/getDropdown';
import FormAutocomplete from '@/components/Input/formDropdown';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import { Combobox } from '@/components/shacdn/combobox';
import { BussinesTripDestination } from './BussinesTripDestination';
import { jsx } from 'react/jsx-runtime';

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
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

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

  const [fileAttachment, setfileAttachment] = React.useState<BusinessTripAttachement[]>([]);

  async function getDetailData() {
    const url = GET_DETAIL_BUSINESS_TRIP(id);
    //fixing data not showing in index 0
    form.setValue('destinations', []);
    try {
      const response = await axios.get(url);
      const data = response.data.data;
      getDestination('', {
        name: 'destination',
        id: 'destination',
        tabel: 'destinations',
        where: {
          key: 'type',
          parameter: response.data.data.purpose_type.type,
        },
      });
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
      //   console.log(data.destinations, ' data.destinations');
      form.setValue(
        'destinations',
        data.destinations.map((destination: any) => ({
          destination: destination.destination,
          pajak_id: destination.pajak_id,
          purchasing_group_id: destination.purchasing_group_id,
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
  const [typePurpose, setTypePurpose] = React.useState<string>('');
  const { dataDropdown: dataDestination, getDropdown: getDestination } = useDropdownOptions();

  const [selectedUserId, setSelectedUserId] = React.useState(
    isAdmin === '0' ? idUser?.toString() : '',
  );

  async function handlePurposeType(value: string) {
    form.setValue('purpose_type_id', value || '');
    const userid = isAdmin == '0' ? idUser || '' : selectedUserId || '';
    const url = GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE(value, userid);
    const getPurposeType = GET_DETAIL_PURPOSE_TYPE(value);
    try {
      const response = await axiosInstance.get(url);
      const responsePurposeType = await axiosInstance.get(getPurposeType);
      const typePurpose = responsePurposeType.data.data.purpose.type;
      if (typePurpose == 'international') {
        totalDestinationHandler('1');
      }
      setTypePurpose(typePurpose);
      setListAllowances(response.data.data as AllowanceItemModel[]);
      getDestination('', {
        name: 'destination',
        id: 'destination',
        tabel: 'destinations',
        where: {
          key: 'type',
          parameter: responsePurposeType.data.data.purpose.type,
        },
      });
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
    console.log(fileAttachment, ' valuesss');
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
        await Inertia.post(`${EDIT_API_BUSINESS_TRIP}/${id}`, formDataEdit, {
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

  // console.log(BusinessTripType.edit, ' business edit');
  // console.log(type, ' id type');
  React.useEffect(() => {
    if (id && type == BusinessTripType.edit) {
      getDetailData();
    }
  }, [type]);

  React.useEffect(() => {
    if (type == BusinessTripType.create) {
      setAllowancesProperty();
    }
  }, [totalDestination, listAllowances, isAdmin, idUser]);

  const [isShow, setIsShow] = React.useState(false);
  const [approvalRoute, setApprovalRoute] = React.useState({
    approvalRequest: [],
    approvalFrom: [],
    acknowledgeFrom: [],
    approvalFromStatusRoute: [],
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
        // console.log(dataApproval);
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
    name: 'total_percent',
  });

  const [totalAllowance, setTotalAllowance] = React.useState(0);
  // Assuming allowance is calculated elsewhere, let's mock it for now
  const allowance = totalAllowance;
  //   // Calculate total based on totalPercent and allowance
  React.useEffect(() => {
    // console.log(form.getValues('destinations'), ' edit destination');
    if (type == BusinessTripType.edit) {
      setIsCashAdvance(form.getValues('cash_advance') ?? false);
    }
    const percentValue = parseFloat((totalPercent || '0').toString());
    // const percentValue = parseFloat(totalPercent || 0); // Ensure totalPercent is a number
    const total = (percentValue / 100) * allowance; // Multiply percent with allowance
    // console.log(total, ' totalll');
    form.setValue('total_cash_advance', formatRupiah(total.toFixed(0), false)); // Save the total in total_cash_advance field
  }, [totalPercent, allowance]); // Recalculate when totalPercent or allowance cha

  const { dataDropdown: dataEmployee, getDropdown: getEmployee } = useDropdownOptions();
  const { dataDropdown: dataPurposeType, getDropdown: getPurposeType } = useDropdownOptions();
  const { dataDropdown: dataCostCenter, getDropdown: getCostCenter } = useDropdownOptions();
  const { dataDropdown: dataTax, getDropdown: getTax } = useDropdownOptions();
  const { dataDropdown: dataPurchasingGroup, getDropdown: getPurchasingGroup } =
    useDropdownOptions();

  React.useEffect(() => {
    getEmployee('', {
      name: 'name',
      id: 'id',
      tabel: 'users',
      idType: 'string',
    });
    getPurposeType('', {
      name: 'name',
      id: 'id',
      tabel: 'purpose_types',
      idType: 'string',
    });
    getCostCenter('', {
      name: 'cost_center',
      id: 'id',
      tabel: 'master_cost_centers',
      idType: 'string',
    });
    getTax('', {
      name: 'mwszkz',
      id: 'id',
      tabel: 'pajaks',
      idType: 'string',
    });
    getPurchasingGroup('', {
      name: 'purchasing_group',
      id: 'id',
      tabel: 'purchasing_groups',
      idType: 'string',
    });
  }, []);

  React.useEffect(() => {
    if (type != BusinessTripType.edit) {
      if (isAdmin == '0') {
        form.setValue('request_for', idUser?.toString() ?? '');
      }
    }
  }, []);

  //   console.log(form.watch('purpose_type_id'), 'sini');
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
                <FormAutocomplete<any>
                  fieldLabel=''
                  options={dataEmployee}
                  fieldName='request_for'
                  isRequired={true}
                  disabled={
                    type == BusinessTripType.edit
                      ? form.watch('request_for')
                        ? true
                        : false
                      : isAdmin == '0'
                        ? true
                        : false
                  }
                  placeholder={'Select Employee'}
                  classNames='mt-2 w-full'
                  onChangeOutside={(value) => {
                    setSelectedUserId(value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td width={200}>Bussiness Trip Purpose Type</td>
              <td>
                <FormAutocomplete<any>
                  fieldLabel=''
                  options={dataPurposeType}
                  fieldName='purpose_type_id'
                  isRequired={true}
                  disabled={
                    type == BusinessTripType.edit
                      ? form.watch('purpose_type_id')
                        ? true
                        : false
                      : false
                  }
                  placeholder={'Select Purpose Type'}
                  classNames='mt-2 w-full'
                  onChangeOutside={async (value: string, data: any) => {
                    await handlePurposeType(value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td width={200}>Cost Center</td>
              <td>
                <FormAutocomplete<any>
                  fieldLabel=''
                  options={dataCostCenter}
                  fieldName='cost_center_id'
                  isRequired={true}
                  disabled={
                    type == BusinessTripType.edit
                      ? form.watch('cost_center_id')
                        ? true
                        : false
                      : false
                  }
                  placeholder={'Select Cost Center'}
                  classNames='mt-2 w-full'
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
              <td className='text-gray-500 text-xs font-extralight'>jpg,jpeg,png,pdf</td>
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
                          disabled={
                            type == BusinessTripType.edit
                              ? form.watch('total_destination')
                                ? true
                                : false
                              : typePurpose == 'international'
                                ? true
                                : false
                          }
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
            pajak={pajak}
            purchasingGroup={purchasingGroup}
            setTotalAllowance={setTotalAllowance}
            dataTax={dataTax}
            dataPurchasingGroup={dataPurchasingGroup}
            dataDestination={dataDestination}
            type={type}
            btEdit={BusinessTripType.edit}
          />
          <Separator className='my-4' />

          {/* CASH ADVANCE */}
          <table className='w-full text-sm mt-10'>
            <tr>
              <td className='w-[50%]'>Cash Advance</td>
              <td className='w-[50%] pb-0'>
                <FormSwitch
                  fieldName={'cash_advance'}
                  isRequired={false}
                  disabled={
                    type == BusinessTripType.edit
                      ? form.watch('cash_advance')
                        ? false
                        : true
                      : false
                  }
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
                            <Select
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

          <ButtonMui
            onClick={async () => await fetchDataValue()}
            variant='contained'
            color='primary'
            type='button'
            style={{
              display:
                type == BusinessTripType.edit
                  ? form.watch('total_destination')
                    ? 'none'
                    : 'block'
                  : 'block',
            }}
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
          <Button type='submit'>submit</Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

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
