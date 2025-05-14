/* eslint-disable eqeqeq */
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
  CLONE_API_BUSINESS_TRIP,
  CREATE_API_BUSINESS_TRIP,
  EDIT_API_BUSINESS_TRIP,
  GET_DATE_BUSINESS_TRIP_BY_USER,
  GET_DETAIL_BUSINESS_TRIP,
  GET_LIST_USER_BUSINESS_TRIP,
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
const ACCEPTED_FILE_TYPES = [
  'heic',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
  'application/pdf',
];

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
  successSubmit,
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
  successSubmit?: (success: boolean) => void;
}) => {
  const formSchema = z
    .object({
      purpose_type_id: z.string().min(1, 'Purpose type required'),
      request_for: z.string().min(1, 'Request is required'),
      cost_center_id: z.string().min(1, 'Cost Center is required'),
      remark: z.string().min(1, 'Remark is required'),
      attachment: z.array(
        z
          .instanceof(File)
          .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
            message: 'File type must be JPG, JPEG, PNG, HEIC or PDF',
          })
          .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: 'File size must be less than 1MB',
          }),
      ),
      total_destination: z.number().min(1, 'Total Destinantion Required'),
      cash_advance: z.boolean().nullable().optional(),
      total_percent: z.number().nullable().optional(),
      total_cash_advance: z.string().nullable().optional(),
      destinations: z.array(
        z.object({
          destination: z.string().min(1, 'Destinantion is Required'),
          restricted_area: z.boolean().nullable().optional(),
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
              start_date: z.date().optional(),
              end_date: z.date().optional(),
            }),
          ),
          allowances: z
            .array(
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
            )
            .min(1, 'Allowances tidak boleh kosong'),
        }),
      ),
    })
    .superRefine(({ cash_advance, total_percent, attachment }, refinementContext) => {
      if (type === BusinessTripType.create && attachment && attachment.length === 0) {
        refinementContext.addIssue({
          path: ['attachment'],
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          type: 'array',
          inclusive: true,
          message: 'Attachment is required',
        });
      }

      if (cash_advance === true) {
        // Validasi jika total_percent kosong
        if (!total_percent || total_percent.toString().trim() === '') {
          refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['total_percent'],
            message: 'Total Percent is required',
          });
        } else {
          // Validasi jika total_percent berada di luar rentang 1-100
          const totalPercentValue = Number(total_percent);
          if (isNaN(totalPercentValue) || totalPercentValue < 1 || totalPercentValue > 100) {
            refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['total_percent'],
              message: 'Total Percent must be a number between 1 and 100',
            });
          }
        }
      }
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
      total_percent: 0,
      total_cash_advance: '0',
      destinations: [
        {
          detail_attedances: [],
          allowances: [],
          destination: '',
          restricted_area: false,
          pajak_id: 'V0',
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
  const [fromRequestNo, setFromRequestNo] = React.useState(null);
  const [listAllowances, setListAllowances] = React.useState<AllowanceItemModel[]>([]);

  function removeLeadingZeros(input: string): string {
    if (/^0+\d+$/.test(input)) {
      return input.replace(/^0+/, '');
    }
    return input;
  }

  async function getDetailData() {
    const url = GET_DETAIL_BUSINESS_TRIP(id);
    //fixing data not showing in index 0
    form.setValue('destinations', []);
    try {
      const response = await axios.get(url);
      const data = response.data.data;
      const urlGetAllowance = GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE(
        data.purpose_type_id,
        data.request_for.id,
      );
      const responsePurposeType = await axiosInstance.get(urlGetAllowance);
      setListAllowances(responsePurposeType.data.data as AllowanceItemModel[]);
      getDestination('', {
        name: 'destination',
        id: 'destination',
        tabel: 'destinations',
        where: {
          key: 'type',
          parameter: data.purpose_type.type,
        },
      });
      setFromRequestNo(data.request_no);
      setfileAttachment(data.attachments as BusinessTripAttachement[]);
      form.setValue('purpose_type_id', data.purpose_type_id.toString());
      form.setValue('request_for', data.request_for.id.toString());
      form.setValue('cost_center_id', removeLeadingZeros(data.cost_center.cost_center.toString()));
      form.setValue('remark', data.remarks);
      form.setValue('total_destination', data.total_destination);
      form.setValue('cash_advance', data.cash_advance == 1 ? true : false);
      form.setValue('total_percent', data.total_percent);
      form.setValue('total_cash_advance', data.total_cash_advance);
      //   console.log(data.destinations, ' data.destinations');
      form.setValue(
        'destinations',
        data.destinations.map((destination: any) => ({
          destination: destination.destination,
          restricted_area: destination.restricted_area == 1 ? true : false,
          pajak_id: destination.pajak.mwszkz,
          purchasing_group_id: destination.purchasing_group.purchasing_group,
          business_trip_start_date: new Date(destination.business_trip_start_date),
          business_trip_end_date: new Date(destination.business_trip_end_date),
          detail_attedances: destination.detail_attedances.map((detail: any) => {
            return {
              ...detail,
              date: new Date(detail.date),
              start_date: new Date(detail.start_date),
              end_date: new Date(detail.end_date),
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

  // const [typePurpose, setTypePurpose] = React.useState<string>('');
  const { dataDropdown: dataDestination, getDropdown: getDestination } = useDropdownOptions();

  const [selectedUserId, setSelectedUserId] = React.useState(
    isAdmin === '0' ? idUser?.toString() : '',
  );

  const [dateBusinessTripByUser, setDateBusinessTripByUser] = React.useState<[]>([]);

  async function getDateBusinessTrip() {
    const userid = isAdmin == '0' ? idUser || 0 : selectedUserId || 0;
    const url = GET_DATE_BUSINESS_TRIP_BY_USER(userid);
    const response = await axiosInstance.get(url);
    setDateBusinessTripByUser(response.data.data);
  }

  async function handlePurposeType(value: string) {
    form.setValue('purpose_type_id', value || '');
    const userid = isAdmin == '0' ? idUser || '' : selectedUserId || '';
    const url = GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE(value, userid);
    const getPurposeType = GET_DETAIL_PURPOSE_TYPE(value);
    try {
      const response = await axiosInstance.get(url);

      const responsePurposeType = await axiosInstance.get(getPurposeType);
      //   const typePurpose = responsePurposeType.data.data.purpose.type;
      //   if (typePurpose == 'international') {
      //     totalDestinationHandler('1');
      //   }
      //   setTypePurpose(typePurpose);
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

  const [selectedDates, setSelectedDates] = React.useState<
    { start: Date | undefined; end: Date | undefined }[]
  >([]);

  const totalDestinationHandler = (value: string) => {
    form.setValue('total_destination', parseInt(value, 10));
    setTotalDestination(value);
    setAllowancesProperty();
    setSelectedDates([]);
    // let valueToInt = parseInt(value);
  };

  const [activeTab, setActiveTab] = React.useState('destination1');

  React.useEffect(() => {
    if (parseInt(totalDestination, 10) < 1) {
      setTotalDestination('1');
    } else {
      setActiveTab(`destination${totalDestination}`);
    }
  }, [totalDestination]);

  const { showToast } = useAlert();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isValid = await form.trigger();
    if (!isValid) {
      // Dapatkan daftar field yang memiliki error
      const errors = form.formState.errors;

      // Looping untuk menemukan tab yang memiliki error
      for (let i = 0; i < destinationField.length; i++) {
        if (errors?.destinations?.[i]) {
          // Pastikan ada error di tab tertentu
          setActiveTab(`destination${i + 1}`); // Pindah ke tab yang error
          break; // Hentikan loop setelah menemukan tab pertama yang error
        }
      }
      return;
    }

    const totalAll = getTotalDes();
    if (totalAll === 0) {
      showToast('Please add at least one destination', 'error');
      return;
    }

    try {
      setLoading(true);
      const alldestinations = form.getValues('destinations');
      const totalDays = getTotalDay(alldestinations);
      const hasRestrictedArea = alldestinations?.some((item) => item.restricted_area === true);
      const formData = new FormData();
      formData.append('is_restricted_area', hasRestrictedArea ? 'true' : 'false');
      formData.append('day', totalDays.toString());
      formData.append('user_id', values.request_for ?? '');
      formData.append('value', totalAll.toString());
      formData.append('purpose_type_id', values.purpose_type_id ?? '');
      formData.append('request_for', values.request_for ?? '');
      formData.append('cost_center_id', values.cost_center_id ?? '');
      formData.append('remark', values.remark ?? '');
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
        // const formDataEdit = new FormData();
        // formDataEdit.append('remark', values.remark ?? '');
        // values.attachment.forEach((file: any, index: number) => {
        //   if (file) {
        //     formDataEdit.append(`attachment[${index}]`, file);
        //   }
        // });
        fileAttachment.forEach((file: any, index: number) => {
          if (file) {
            formData.append(`file_existing[${index}]`, JSON.stringify(file));
          }
        });
        await Inertia.post(`${CLONE_API_BUSINESS_TRIP}/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showToast('succesfully updated data', 'success');
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      // console.log(response);
      successSubmit?.(true);
    } catch (e) {
      const error = e as AxiosError;
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    // console.log('values bg', values);
  };

  function setAllowancesProperty() {
    const destinationForm = [];

    const destinationCount = parseInt(totalDestination);

    for (let i = 0; i < destinationCount; i++) {
      destinationForm.push({
        destination: '',
        // business_trip_start_date: new Date(),
        // business_trip_end_date: new Date(),
        business_trip_start_date: '',
        business_trip_end_date: '',
        pajak_id: 'V0',
        purchasing_group_id: '',
        restricted_area: false,
        allowances: [],
        detail_attedances: [],
      });
    }
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

  const [isClone, setIsClone] = React.useState(false);

  React.useEffect(() => {
    if (type == BusinessTripType.create) {
      setAllowancesProperty();
    }
    getDateBusinessTrip();
  }, [totalDestination, listAllowances, isAdmin, idUser, selectedUserId]);

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

  const getTotalDay = (data: any[]) => {
    const allDates: string[] = [];
    data.forEach((destination) => {
      destination.detail_attedances.forEach((detail: any) => {
        if (detail.start_date) allDates.push(detail.start_date);
        if (detail.end_date) allDates.push(detail.end_date);
      });
    });

    // Ubah ke Date object dan urutkan
    const sortedDates = allDates
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());

    if (sortedDates.length === 0) {
      return 0;
    } else {
      const start = sortedDates[0];
      const end = sortedDates[sortedDates.length - 1];

      // Hitung jumlah hari, +1 agar termasuk tanggal awal
      const dayDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return dayDiff;
    }
  };

  const fetchDataValue = async () => {
    try {
      const totalAll = getTotalDes();
      //   const totalAll = 200000;
      const alldestinations = form.getValues('destinations');
      if (totalAll === 0) {
        showToast('Please fill the balance', 'error');
        return;
      }
      const totalDays = getTotalDay(alldestinations);

      const hasRestrictedArea = alldestinations?.some((item) => item.restricted_area === true);
      const response = await axiosInstance.get('/check-approval', {
        params: {
          is_restricted_area: hasRestrictedArea,
          day: totalDays,
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
    // const totalAll = getTotalDes();
    // if (totalAll > 0) {
    //   fetchDataValue();
    // }
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
    if (type == BusinessTripType.clone) {
      setIsCashAdvance(form.getValues('cash_advance') ?? false);
    }
    const percentValue = parseFloat((totalPercent || '0').toString());
    // const percentValue = parseFloat(totalPercent || 0); // Ensure totalPercent is a number
    const total = (percentValue / 100) * allowance; // Multiply percent with allowance
    // console.log(total, ' totalll');
    form.setValue('total_cash_advance', formatRupiah(total.toFixed(0), false)); // Save the total in total_cash_advance field
  }, [totalPercent, allowance]); // Recalculate when totalPercent or allowance cha

  const { dataDropdown: dataEmployee, getDropdown: getEmployee } = useDropdownOptions(
    GET_LIST_USER_BUSINESS_TRIP,
  );
  const { dataDropdown: dataPurposeType, getDropdown: getPurposeType } = useDropdownOptions();
  const { dataDropdown: dataCostCenter, getDropdown: getCostCenter } = useDropdownOptions();
  const { dataDropdown: dataTax, getDropdown: getTax } = useDropdownOptions();
  const { dataDropdown: dataPurchasingGroup, getDropdown: getPurchasingGroup } =
    useDropdownOptions();

  React.useEffect(() => {
    const fetchData = async () => {
      if (id && type == BusinessTripType.clone) {
        await getDetailData();
        setIsClone(true);
      }
      getEmployee('', {
        name: 'name',
        id: 'id',
        tabel: 'users',
        hasValue: {
          key: form.getValues('request_for') ? 'id' : '',
          value: form.getValues('request_for') ?? '',
        },
        idType: 'string',
      });
      getPurposeType('', {
        name: 'name',
        id: 'id',
        tabel: 'purpose_types',
        idType: 'string',
        softDelete: true,
      });
      getCostCenter('', {
        name: 'desc',
        id: 'cost_center',
        tabel: 'master_cost_centers',
        idType: 'string',
        isMapping: true,
        hiddenZero: true,
      });
      getTax('', {
        name: 'description',
        id: 'mwszkz',
        tabel: 'pajaks',
        idType: 'string',
        isMapping: true,
      });
      getPurchasingGroup('', {
        name: 'purchasing_group_desc',
        id: 'purchasing_group',
        tabel: 'purchasing_groups',
        idType: 'string',
        isMapping: true,
      });
    };

    fetchData();
  }, [type]);

  React.useEffect(() => {
    if (type != BusinessTripType.clone) {
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
          <table className='mt-4 text-xs font-thin reimburse-form-table'>
            <tr>
              <td width={200}>Request No.</td>
              <td>ODR-YYYY-MM-XXXXXXXX</td>
            </tr>
            {isClone && (
              <tr>
                <td width={200}>From Request No.</td>
                <td className='text-sm'>{fromRequestNo}</td>
              </tr>
            )}
            <tr>
              <td width={200}>
                Request For <span className='text-red-600'>*</span>
              </td>
              <td>
                <FormAutocomplete<any>
                  fieldLabel=''
                  options={dataEmployee}
                  fieldName='request_for'
                  isRequired={true}
                  disabled={isAdmin == '0' ? true : false}
                  placeholder={'Select Employee'}
                  classNames='mt-2 w-full'
                  onSearch={(search: string, data: any) => {
                    const isLabelMatch = dataEmployee?.some((option) => option.label === search);
                    if (search.length > 0 && !isLabelMatch) {
                      getEmployee(search, {
                        name: 'name',
                        id: 'id',
                        tabel: 'users',
                        search: search,
                        idType: 'string',
                      });
                    } else if (search.length == 0 && !isLabelMatch) {
                      getEmployee('', {
                        name: 'name',
                        id: 'id',
                        tabel: 'users',
                        idType: 'string',
                      });
                    }
                  }}
                  onChangeOutside={(value) => {
                    setSelectedUserId(value);
                    if (value === null) {
                      setSelectedDates([]);
                    }
                  }}
                  onFocus={() => {
                    const value = form.getValues('request_for');
                    getEmployee('', {
                      name: 'name',
                      id: 'id',
                      tabel: 'users',
                      hasValue: {
                        key: value ? 'id' : '',
                        value: value ?? '',
                      },
                      idType: 'string',
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td width={200}>
                Bussiness Trip Purpose Type<span className='text-red-600'>*</span>
              </td>
              <td>
                <FormAutocomplete<any>
                  fieldLabel=''
                  options={dataPurposeType}
                  fieldName='purpose_type_id'
                  isRequired={true}
                  disabled={false}
                  placeholder={'Select Purpose Type'}
                  classNames='mt-2 w-full'
                  onChangeOutside={async (value: string, data: any) => {
                    await handlePurposeType(value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td width={200}>
                Cost Center<span className='text-red-600'>*</span>
              </td>
              <td>
                <FormAutocomplete<any>
                  fieldLabel=''
                  options={dataCostCenter}
                  fieldName='cost_center_id'
                  isRequired={true}
                  disabled={false}
                  placeholder={'Select Cost Center'}
                  classNames='mt-2 w-full'
                />
              </td>
            </tr>
            <tr>
              <td width={200}>
                Remark<span className='text-red-600'>*</span>
              </td>
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
              <td width={200}>
                File Attachment<span className='text-red-600'>*</span>
              </td>
              <td>
                <FormField
                  control={form.control}
                  name='attachment'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='mb-1 text-xs text-gray-500 font-extralight'>
                        Max File: 1000KB
                      </FormLabel>
                      <FormControl>
                        <input
                          className='flex w-full px-3 py-1 text-xs transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                          type='file'
                          accept='.jpg,.jpeg,.png,.pdf,.heic,.heif'
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
                      {/* {form.formState.errors.attachment &&
                      Array.isArray(form.formState.errors.attachment)
                        ? form.formState.errors.attachment.map((error, index) => (
                            <p key={index} className='text-[0.8rem] font-medium text-destructive'>
                              {error.message}
                            </p>
                          ))
                        : null} */}
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
                    <div className='flex items-center gap-4' key={index}>
                      <a
                        href={attachment.url}
                        target='_blank'
                        className='inline-block text-blue-500'
                        key={index}
                        rel='noreferrer'
                      >
                        {attachment.file_name}
                      </a>
                      <button
                        type='button'
                        onClick={() => handleDelete(attachment.id)}
                        className='inline-block mt-2 ml-2 text-red-500 cursor-pointer'
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
              <td className='text-xs text-gray-500 font-extralight'>
                PDF, JPG, JPEG, PNG and HEIC Max 1mb
              </td>
            </tr>
            <tr>
              <td width={200}>
                Total Destination<span className='text-red-600'>*</span>
              </td>
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
                          disabled={false}
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
            btClone={BusinessTripType.clone}
            dateBusinessTripByUser={dateBusinessTripByUser}
            setSelectedDates={setSelectedDates}
            selectedDates={selectedDates}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <Separator className='my-4' />

          {/* CASH ADVANCE */}
          <table className='w-full mt-10 text-sm'>
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
                      name={'total_percent'}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type='number'
                              {...field}
                              value={field.value || ''}
                              className='w-[50%]'
                              // min="1"
                              // max="100"
                              onChange={(e) => {
                                const inputValue = e.target.value;

                                // Pastikan input hanya angka
                                if (!/^\d*$/.test(inputValue)) return;

                                const number = parseInt(inputValue, 10);

                                // Batasi nilai antara 1 dan 100
                                if (number >= 1 && number <= 100) {
                                  field.onChange(number); // Update nilai valid
                                } else if (inputValue === '') {
                                  field.onChange(''); // Izinkan kosong
                                }
                              }}
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
                            <Input
                              value={field.value || ''}
                              readOnly={true}
                              className='w-[50%] mt-3'
                            />
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
            // style={{
            //   display:
            //     type == BusinessTripType.edit
            //       ? form.watch('total_destination')
            //         ? 'none'
            //         : 'block'
            //       : 'block',
            // }}
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
          <Button type='submit' loading={loading}>
            submit
          </Button>
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
