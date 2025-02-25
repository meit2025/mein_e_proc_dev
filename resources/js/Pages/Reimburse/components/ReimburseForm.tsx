import { useState, useEffect } from 'react';
import { Button } from '@/components/shacdn/button';
import { Button as ButtonMui, FormHelperText } from '@mui/material';
import { Inertia } from '@inertiajs/inertia';
import moment from 'moment';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import {
  Form,
  FormControl,
  FormLabel,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/shacdn/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { Textarea } from '@/components/shacdn/textarea';
import '../css/reimburse.scss';
import { ScrollArea } from '@/components/shacdn/scroll-area';
import axiosInstance from '@/axiosInstance';
import { AxiosError } from 'axios';
import { Separator } from '@/components/shacdn/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shacdn/select';
import FormAutocomplete from '@/components/Input/formDropdown';
import { CustomDatePicker } from '@/components/commons/CustomDatePicker';
import { Input } from '@/components/shacdn/input';
import { useAlert } from '../../../contexts/AlertContext.jsx';
import { usePage } from '@inertiajs/react';
import { Currency, PurchasingGroup, User, Tax, CostCenter, ReimburseFormType } from '../model/listModel';
import { FormType } from '@/lib/utils';
import useDropdownOptions from '@/lib/getDropdown';
import {
  GET_LIST_MASTER_REIMBUSE_TYPE,
  GET_LIST_EMPLOYEE_REIMBURSE,
  GET_LIST_FAMILY_REIMBURSE,
} from '@/endpoint/reimburse/api';
import { CustomFormWrapper } from '@/components/commons/CustomFormWrapper';
import {
  WorkflowApprovalDiagramInterface,
  WorkflowApprovalStepInterface,
  WorkflowComponent,
} from '@/components/commons/WorkflowComponent';
import { CustomStatus } from '@/components/commons/CustomStatus';

interface Props {
  onSuccess?: (value?: boolean) => void;
  taxDefaultValue: string;
  uomDefaultValue: string;
  currencies: Currency[];
  categories: string;
  users: User[];
  edit_url?: string;
  update_url?: string;
  store_url?: string;
  type?: ReimburseFormType;
  currentUser?: User;
}

interface reimburseAttachement {
  id: number;
  url: string;
  file_name: string;
}

export const ReimburseForm: React.FC<Props> = ({
  onSuccess,
  currencies,
  taxDefaultValue,
  uomDefaultValue,
  categories,
  users,
  edit_url,
  update_url,
  store_url,
  type,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState('form1');
  const { showToast } = useAlert();
  const { errors } = usePage().props;
  const { dataDropdown: dataEmployee, getDropdown: getEmployee } = useDropdownOptions(GET_LIST_EMPLOYEE_REIMBURSE);
  const { dataDropdown: dataUom, getDropdown: getUom } = useDropdownOptions();
  const { dataDropdown: dataTax, getDropdown: getTax } = useDropdownOptions();
  const { dataDropdown: dataPurchasingGroup, getDropdown: getPurchasingGroup } = useDropdownOptions('api/master-pr/purchasing-group/dropdown-list');
  const { dataDropdown: dataCostCenter, getDropdown: getCostCenter } = useDropdownOptions('api/master/cost-center/dropdown-list');

  const [dataReimburseType, setDataReimburseType] = useState<any[]>([]);
  const [dataFamily, setDataFamily] = useState<any[]>([]);
  const [requestStatus, setRequestStatus] = useState<any[]>(false);
  const [isShow, setIsShow] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [detailLimit, setDetailLimit] = useState<any[]>([]);

  const [approvalRoute, setApprovalRoute] = useState({
    approvalRequest: [],
    approvalFrom: [],
    acknowledgeFrom: [],
    approvalFromStatusRoute: [],
  });

  const MAX_FILE_SIZE = 1 * 1024 * 1024; 
  const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'image/heic', 'image/heif'];

  const formSchema = z.object({
    formCount: z.string().min(1, 'total form must be have value'),
    remark_group: z.string().min(1, 'header remark is required'),
    cost_center: z.string().min(1, 'cost center required'),
    requester: z.string().min(1, 'requester required'),
    value: z.number().optional(),
    user_id: z.string().optional(),
    forms: z.array(
      z.object({
        reimburseId: z.string().optional(),
        for: z.string().optional(),
        group: z.string().optional(),
        reimburse_type: z.string().min(1, 'reimburse type is required'),
        short_text: z.string().min(1, 'remarks is required'),
        balance: z.string(),
        remaining_balance_when_request: z.number(),
        currency: z.string().min(1, 'currency required'),
        tax_on_sales: z.string().min(1, 'tax required'),
        purchase_requisition_unit_of_measure: z.string().min(1, 'uom required'),
        purchasing_group: z.string().min(1, 'Purchasing Group required'),
        type: z.any(),
        item_delivery_data: z.date(),
        claim_date: z.date(),
        attachment: z.array(
          z
            .instanceof(File)
            .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
              message: 'File type must be JPG, JPEG, PNG, HEIC, or PDF',
            })
            .refine((file) => file.size <= MAX_FILE_SIZE, {
              message: 'File size must be less than 1MB',
            })
        ).min(type === ReimburseFormType.create ? 1 : 0, 'Attachment is required'),
        // url: z.string().optional(),
      }),
    ),
  });
  
  useEffect(() => {
    getTax('', {
      name: 'mwszkz',
      id: 'id',
      tabel: 'pajaks',
      where:{
        key       : 'mwszkz',
        parameter : 'V0'
      }
    });

    getUom('', {
      name: 'unit_of_measurement_text',
      id: 'id',
      tabel: 'uoms',
      where:{
        key       : 'iso_code',
        parameter : 'PCE'
      }
    });

    getPurchasingGroup('', {
      name: 'purchasing_group_desc',
      id: 'id',
      tabel: 'purchasing_groups',
      idType: 'string',
    });

    getCostCenter('', {
      name: 'cost_center',
      id: 'id',
      tabel: 'master_cost_centers',
      idType: 'string',
    });

    getEmployee('', {
      name: 'name',
      id: 'nip',
      tabel: 'users',
    });

    if (form.getValues('requester') !== '') {
      fetchReimburseType(0);
    }
  }, []);

  const defaultValues = {
    formCount: '1',
    remark_group: '',
    cost_center: '',
    requester: String(currentUser?.is_admin) === '1' ? '' : currentUser?.nip,
    forms: [
      {
        reimburseId: '',
        for: '',
        group: '',
        reimburse_type: '',
        short_text: '',
        balance: '',
        remaining_balance_when_request: 0,
        currency: 'IDR',
        tax_on_sales: taxDefaultValue,
        purchase_requisition_unit_of_measure: uomDefaultValue,
        purchasing_group: '',
        type: '',
        item_delivery_data: new Date(),
        claim_date: new Date(),
        attachment: [],
        // url: '',
      },
    ],
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  const { fields: formFields, update: updateForm } = useFieldArray({
    control: form.control,
    name: 'forms',
  });

  async function getDetailData() {
    form.setValue('forms', []);

    setLoading(true);

    try {
      const response = await axiosInstance.get(edit_url ?? '');
      const reimburseGroup = response.data.data.group;
      const reimburseForms = response.data.data.forms as [];

      setRequestStatus(reimburseGroup.reimbursementStatus)

      const reimburseFormMapping = reimburseForms.map((map: any) => {
        return {
          reimburseId: String(map.id),
          for: String(map.for),
          group: String(map.group),
          reimburse_type: map.reimburse_type.code,
          short_text: map.short_text,
          balance: type === ReimburseFormType.edit ? map.balance : '',
          currency: map.currency,
          tax_on_sales: String(map.tax_on_sales),
          purchase_requisition_unit_of_measure: String(map.purchase_requisition_unit_of_measure),
          purchasing_group: String(map.purchasing_group),
          type: map.type,
          item_delivery_data: new Date(map.item_delivery_data),
          claim_date: new Date(map.claim_date),
          attachment: [],
          // url: GET_LIST_MASTER_REIMBUSE_TYPE,
        };
      });

      form.setValue('formCount', reimburseForms.length.toString());
      form.setValue('remark_group', reimburseGroup.remark);
      form.setValue('cost_center', String(reimburseGroup.cost_center.id));
      form.setValue('requester', reimburseGroup.requester);

      
      let formCounter = 0;
      for (const map of reimburseForms) {
        await fetchReimburseType(formCounter, {reimburse_type: map.reimburse_type.code})
        await fetchFamily(formCounter, {
          type: map.type,
          reimburse_type: map.reimburse_type.code
        });
        await getDataByLimit(formCounter, {
          reimburse_type: map.reimburse_type.code,
          for: map.reimburse_type.is_employee === 1 ? null : map.for
        });
        formCounter++;
      }

      form.setValue('forms', reimburseFormMapping);
      setLoading(false);
    } catch (e) {
      const error = e as AxiosError;
      setLoading(false);
    }
  }

  useEffect(() => {
    if (type === ReimburseFormType.edit || type === ReimburseFormType.clone) {
      setLoading(true);
      getDetailData();
    }
  }, [type]);

  const handleSearchEmployee = async (query: string) => {
    if (query.length > 0) {
      getEmployee('', {
        name: 'name',
        id: 'nip',
        tabel: 'users',
      });
    }
  };

  const fetchReimburseType = async (index:number, otherParams:any = null) => {
    const response = await axiosInstance.get(GET_LIST_MASTER_REIMBUSE_TYPE, {
      params: {
        user      : form.getValues('requester'),
        hasValue  : otherParams != null ? otherParams.reimburse_type : null
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    setDataReimburseType((prev) => {
      const newData = [...prev];
      newData[index] = response.data.data;
      return newData;
    });
  };

  const handleSearchReimburseType = async (query: string, index: number) => {
    if (query && query.length > 0) {
      try {
        const response = await axiosInstance.get(GET_LIST_MASTER_REIMBUSE_TYPE, {
          params: {
            search: query,
            user: form.getValues('requester'),
          },
        });
        setDataReimburseType((prev) => {
          const newData = [...prev];
          newData[index] = response.data.data;
          return newData;
        });
      } catch (error) {
        console.error('Error searching reimburse types:', error);
      }
    }
  };

  const fetchFamily = async (index: number, otherParams: any) => {
    const response = await axiosInstance.get(GET_LIST_FAMILY_REIMBURSE, {
      params: {
        user: form.getValues('requester'),
        familyRelationship: otherParams.type == 'Family' ? '0' : '1',
        reimburseType: otherParams.reimburse_type
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setDataFamily((prev) => {
      const newData = [...prev];
      newData[index] = response.data.data;
      return newData;
    });
  };

  const onChangeEmployee = (value: string) => {
    for (let index = 0; index < formFields.length; index++) {
      fetchReimburseType(index);
    }
    if (value == null) {
      for (let index = 0; index < formFields.length; index++) {
        form.setValue(`forms.${index}.reimburse_type`, '');
        form.setValue(`forms.${index}.for`, '');
      }
    }
    
    setDetailLimit([]);
    setDataFamily([]);
  };

  function generateForms(count: string) {
    const forms = [...form.getValues('forms')];
    for (let i = 0; i < parseInt(count); i++) {
      if (i + 1 > forms.length) {
        fetchReimburseType(i);
        const object = {
          reimburseId: '',
          for: '',
          group: '',
          reimburse_type: '',
          short_text: '',
          balance: '',
          remaining_balance_when_request: 0,
          currency: 'IDR',
          tax_on_sales: taxDefaultValue,
          purchase_requisition_unit_of_measure: uomDefaultValue,
          purchasing_group: '',
          type: '',
          item_delivery_data: new Date(),
          claim_date: new Date(),
          attachment: []
          // url: '',
        };

        forms.push(object);
      }
    }

    form.setValue('forms', forms);
  }

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (detailLimit) {
      for (let index = 0; index < detailLimit.length; index++) {
        let formLength = values.forms.length == 0 ? 0 : values.forms.length - 1;
        
        if (detailLimit[index]?.type_limit !== 'Unlimited' && parseInt(detailLimit[index]?.limit) == 0) {
          showToast('Claim Limit for form '+ (index + 1) +' is Empty, Please Contact the Admin', 'error');
          return;
        }
        
        if (values.forms[index].balance == '' || parseInt(values.forms[index].balance) == 0) {
          showToast('Claim Balance for form '+ (index + 1) +' cannot be 0', 'error');
          return;
        }

        if (parseInt(detailLimit[index]?.balance ?? 0) < parseInt(values.forms[index].balance ?? 0)) {
          showToast(
            'Please check your balance input for forms '+ (index + 1) +'  is not must be above ' + detailLimit[index]?.balance,
            'error',
          );
          return;
        }
        
        // update format date
        values.forms = values.forms.map((form, formIndex) => ({
          ...form,
          claim_date: moment(form.claim_date).format('YYYY-MM-DD'),
          item_delivery_data: moment(form.item_delivery_data).format('YYYY-MM-DD'),
          remaining_balance_when_request: parseInt(detailLimit[formIndex]?.balance ?? 0), // Ganti index dengan formIndex
        }));
      }
    }
    const totalNominal = values.forms.reduce((acc, item) => acc + parseInt(item.balance) || 0, 0);

    values.value = totalNominal;
    values.user_id = values?.requester || '0';
    try {
      let response;
      if (type === ReimburseFormType.edit) {
        response = await axiosInstance.put(update_url ?? '', values, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axiosInstance.post(store_url ?? '', values, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      showToast(response?.data?.data, 'success');
      onSuccess();
    } catch (e) {
      const error = e as AxiosError;
    }
  };

  async function getDataByLimit(index: number, param: any = null) {
    const data = form.getValues(`forms.${index}`);
  
    const params = {
      user: form.getValues('requester'),
      reimbuse_type: param != null ? param.reimburse_type : data.reimburse_type,
      for: param != null ? param.for : data.for,
    };
    
    try {
      const response = await axiosInstance.get('reimburse/data-limit-and-balance', {
        params: params,
      });

      setDetailLimit((prev) => {
        const forms = form.getValues('forms');
        const sameTypeForms = forms.filter((formItem, idx) => 
            idx !== index && formItem.reimburse_type === data.reimburse_type
        );
        const totalBalance = sameTypeForms.reduce((acc, curr) => acc + parseInt(curr.balance) || 0, 0);
        
        const newData = [...prev];
        newData[index] = {
          ...response.data.data,
          balance: response.data.data.balance - totalBalance,
          limit: response.data.data.type_limit == 'Unlimited' ? response.data.data.type_limit : Math.max(0, response.data.data.limit - sameTypeForms.length),
        };
        
        return newData;
      });
    } catch (e) {
      showToast(e?.response?.data?.message, 'error');
    }
  }
  
  const fetchDataValue = async () => {
    try {
      const values = form.getValues('forms');
      const reimburseCostFormList = values.map((item, index) => ({
        index,
        value: item.balance ? parseInt(item.balance) : 0,
      }));
      
      const hasZeroValue = reimburseCostFormList.some(item => item.value === 0);
      if (hasZeroValue) {
        const index = reimburseCostFormList.findIndex(item => item.value === 0);
        showToast(`Please fill the balance for form ${index + 1}`, 'error');
        return;
      }

      const totalNominal = values.reduce((acc, item) => acc + (parseInt(item.balance) || 0), 0);
      const response = await axiosInstance.get('/check-approval', {
        params: {
          value: totalNominal,
          requester: form.getValues('requester'),
          type: 'REIM',
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

  useEffect(() => {
    const values = form.getValues('forms');
    const totalNominal = values.reduce((acc, item) => acc + parseInt(item.balance) || 0, 0);
    if (totalNominal > 0 && isShow === true) {
      fetchDataValue();
    }
  }, [form.watch('forms'), form.watch('requester')]);

  return (
    <ScrollArea className='h-[600px] w-full'>
      <CustomFormWrapper isLoading={isLoading}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <table className='text-xs mt-4 reimburse-form-table font-thin w-full'>
              <tbody>
                <tr>
                  <td className='w-1/4'>Request Status</td>
                  <td>
                    {requestStatus && 
                      <CustomStatus
                        name={requestStatus?.name}
                        className={requestStatus?.classname}
                        code={requestStatus?.code}
                      />
                    }
                  </td>
                </tr>
                <tr>
                  <td className='w-1/4'>Remark Header<span className='text-red-600'>*</span></td>
                  <td>
                    <FormField
                      control={form.control}
                      name='remark_group'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder='Insert remark' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>

                <tr>
                  <td className='w-1/4'>Cost Center<span className='text-red-600'>*</span></td>
                  <td>
                    <FormAutocomplete<any>
                      fieldLabel={''}
                      options={dataCostCenter}
                      fieldName='cost_center'
                      disabled={type === ReimburseFormType.edit}
                      placeholder={'Cost Center'}
                      classNames='mt-2 w-full'
                      onChangeOutside={async (search, data) => {
                        if (search.length > 0 && search !== data?.value) {
                          getCostCenter(search, {
                            name: 'cost_center',
                            id: 'id',
                            tabel: 'master_cost_centers',
                            idType: 'string',
                            search: search,
                          })
                        }
                      }}
                    />
                  </td>
                </tr>

                <tr>
                  <td className='w-1/4'>Employee<span className='text-red-600'>*</span></td>
                  <td>
                    <FormAutocomplete<any>
                      options={dataEmployee}
                      fieldName='requester'
                      disabled={String(currentUser?.is_admin) === '0' || type === ReimburseFormType.edit}
                      placeholder={'Select Employee'}
                      onSearch={handleSearchEmployee}
                      onChangeOutside={(value) => onChangeEmployee(value)}
                      classNames='mt-2 w-full'
                    />
                  </td>
                </tr>
                <tr>
                  <td className='w-1/4'>Number of Forms</td>
                  <td>
                    <FormField
                      control={form.control}
                      name='formCount'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              disabled={type === ReimburseFormType.edit}
                              onValueChange={(value) => {
                                field.onChange(value);
                                generateForms(value);
                                handleTabChange(`form${parseInt(value)}`);

                                const forms = form.getValues('forms');
                                if (forms.length > parseInt(value)) {
                                  const updatedForms = forms.slice(0, parseInt(value));
                                  form.setValue('forms', updatedForms);

                                  setDetailLimit((prev) => {
                                    let newDetailLimit = [...prev];
                                    newDetailLimit = newDetailLimit.slice(0, parseInt(value));
                                    return newDetailLimit;
                                  })
                                }
                              }}
                              value={field.value?.toString()}
                            >
                              <SelectTrigger className='w-[200px]'>
                                <SelectValue placeholder='Select number of forms' />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 3 }, (_, i) => i + 1).map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
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
              </tbody>
            </table>

            <Separator className='my-4' />

            <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
              <TabsList className={'flex items-center justify-start space-x-4'}>
                {' '}
                {/* Flexbox for horizontal layout */}
                {Array.from({ length: form.watch('formCount') || 1 }).map((_, index) => (
                  <TabsTrigger key={index} value={`form${index + 1}`}>
                    Form {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>

              {formFields.map((formValue: any, index: number) => {
                return (
                  <TabsContent key={index} value={`form${index + 1}`}>
                    <FormField
                      control={form.control}
                      name={`forms.${index}.reimburseId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className='sr-only'
                              value={formValue.reimburseId}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <table className='text-xs mt-4 reimburse-form-detail font-thin'>
                        <tbody>
                          <tr>
                            <td className='w-1/4'>Type of Reimbursement<span className='text-red-600'>*</span></td>
                            <td>
                              <FormAutocomplete<any>
                                options={dataReimburseType[index]}
                                fieldName={`forms.${index}.reimburse_type`}
                                disabled={form.getValues('requester') == '' || type === ReimburseFormType.edit}
                                placeholder={'Select Reimburse Type'}
                                onChangeOutside={(query: string, data: any) => {
                                  const currentRequester = form.getValues('requester');
                                  if (
                                    query !== data?.value &&
                                    currentRequester !== ''
                                  ) handleSearchReimburseType(query, index);

                                  if (data?.value) {
                                    let selectedValue = dataReimburseType[index].filter(reimburseType => reimburseType.value == data.value)[0];
                                    
                                    updateForm(index, {
                                      ...formValue,
                                      reimburse_type: data?.value,
                                      type: selectedValue.is_employee === 1 ? 'Employee' : 'Family'
                                    });
                                    
                                    if (selectedValue.is_employee === 1) {
                                      getDataByLimit(index, {reimburse_type: data?.value, for: null});
                                    } else {
                                      setDetailLimit((prev) => {
                                        const newDetailLimit = [...prev];
                                        newDetailLimit[index] = [];
                                        return newDetailLimit;
                                      })
                                      form.setValue(`forms.${index}.balance`, '')
                                      fetchFamily(index, {type: 'Family', reimburse_type: data?.value})
                                    }
                                    
                                  } else {
                                    setDetailLimit((prev) => {
                                      const newDetailLimit = [...prev];
                                      newDetailLimit[index] = [];
                                      return newDetailLimit;
                                    })
                                    updateForm(index, {
                                      ...formValue,
                                      balance: '',
                                    })

                                    form.setValue(`forms.${index}.for`, '')
                                    setDataFamily((prev) => {
                                      const newData = [...prev];
                                      newData[index] = [];
                                      return newData;
                                    })

                                    const forms = form.getValues('forms');
                                    forms.forEach((formItem, idx) => {
                                      if (idx > index && forms[idx].reimburse_type === formValue.reimburse_type) {
                                        const remainingBalance = detailLimit[idx]?.balance || 0;
                                        const remainingLimit = detailLimit[idx]?.limit || 0;

                                        setDetailLimit((prev) => {
                                          const newDetailLimit = [...prev];
                                          newDetailLimit[idx] = {
                                            ...newDetailLimit[idx],
                                            balance: remainingBalance + parseInt(formValue.balance || '0'),
                                          };

                                          if (detailLimit[idx]?.type_limit !== 'Unlimited') {
                                            newDetailLimit[idx] = {
                                              ...newDetailLimit[idx],
                                              limit: remainingLimit + 1,
                                            };
                                          }
                                          return newDetailLimit;
                                        });

                                        form.setValue(`forms.${idx}.balance`, '');
                                      }
                                    })
                                  }
                                }}
                                classNames='mt-2 w-full'
                              />
                              {form.formState.errors?.forms?.[index]?.reimburse_type && (
                                <FormHelperText error>
                                  {form.formState.errors?.forms?.[index]?.reimburse_type?.message}
                                </FormHelperText>
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td className='w-1/4'>Family</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.for`}
                                render={({ field }) => ( 
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        disabled={(dataReimburseType?.[index]?.filter(reimburseType => reimburseType?.value == form.getValues(`forms.${index}.reimburse_type`))?.[0])?.is_employee === 1 || type === ReimburseFormType.edit}
                                        onValueChange={(value) =>
                                          {
                                            updateForm(index, {
                                              ...formValue,
                                              for: value,
                                            });

                                            getDataByLimit(index, {reimburse_type: form.getValues(`forms.${index}.reimburse_type`), for: value});
                                          }
                                        }
                                        defaultValue={formValue?.for}
                                        value={formValue.for}
                                      >
                                        <SelectTrigger className='w-[200px]'>
                                          <SelectValue placeholder='-' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {dataFamily[index]?.map((family) => (
                                            <SelectItem
                                              key={family.value}
                                              value={family.value.toString()}
                                            >
                                              {family.label}
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
                            <td className='w-1/4'>Purchasing Group<span className='text-red-600'>*</span></td>
                            <td>
                              <FormAutocomplete<any>
                                fieldLabel={''}
                                options={dataPurchasingGroup}
                                fieldName={`forms.${index}.purchasing_group`}
                                disabled={type === ReimburseFormType.edit}
                                placeholder={'Puchasing Group'}
                                classNames='mt-2 w-full'
                                onChangeOutside={async (search, data) => {
                                  if (search.length > 0 && search !== data?.value) {
                                    await getPurchasingGroup(search, {
                                      name: 'purchasing_group_desc',
                                      id: 'id',
                                      tabel: 'purchasing_groups',
                                      idType: 'string',
                                      search: search,
                                    })
                                  }
                                  
                                  if (data?.value) {
                                    updateForm(index, {
                                      ...formValue,
                                      purchasing_group: data?.value,
                                    });
                                  }
                                }}
                              />
                              {form.formState.errors?.forms?.[index]?.purchasing_group && (
                                <FormHelperText error>
                                  {form.formState.errors?.forms?.[index]?.purchasing_group?.message}
                                </FormHelperText>
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td className='w-1/4'>Tax</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.tax_on_sales`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        disabled={true}
                                        onValueChange={(value) => {
                                          updateForm(index, {
                                            ...formValue,
                                            tax_on_sales: value,
                                          });
                                        }}
                                        defaultValue={formValue.tax_on_sales}
                                      >
                                        <SelectTrigger className='w-[200px]'>
                                          <SelectValue placeholder='-' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {(dataTax ?? []).map((tax, index) => (
                                            <SelectItem
                                              key={tax.value}
                                              value={tax.value.toString()}
                                            >
                                              {tax.description} - {tax.label}
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
                            <td className='w-1/4'>Uom</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.purchase_requisition_unit_of_measure`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        disabled={true}
                                        onValueChange={(value) => {
                                          updateForm(index, {
                                            ...formValue,
                                            purchase_requisition_unit_of_measure: String(value),
                                          });
                                        }}
                                        defaultValue={formValue.purchase_requisition_unit_of_measure}
                                      >
                                        <SelectTrigger className='w-[200px]'>
                                          <SelectValue placeholder='-' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {(dataUom ?? []).map((uom, index) => (
                                            <SelectItem
                                              key={uom.value}
                                              value={uom.value.toString()}
                                            >
                                              {`${uom.label} - ${uom.iso_code}`}
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
                            <td className='w-1/4'>Remark Item<span className='text-red-600'>*</span></td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.short_text`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        placeholder='Insert remark'
                                        onChange={(event) => {
                                          updateForm(index, {
                                            ...formValue,
                                            short_text: event.target.value,
                                          });
                                        }}
                                        defaultValue={formValue.short_text}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </td>
                          </tr>

                          <tr>
                            <td className='w-1/4'>Current Balance</td>
                            <td>
                            <span className='font-bold'>{detailLimit[index]?.balance && formatRupiah(detailLimit[index]?.balance)}</span>
                            </td>
                          </tr>

                          <tr>
                            <td className='w-1/4'>Limit Claim</td>
                            <td>
                              <span className='font-bold'>{detailLimit[index]?.limit}</span>{' '}
                            </td>
                          </tr>

                          <tr>
                            <td className='w-1/4'>Receipt Date</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.item_delivery_data`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <CustomDatePicker
                                        disabled={type === ReimburseFormType.edit}
                                        initialDate={
                                          field.value instanceof Date
                                            ? field.value
                                            : new Date(field.value)
                                        }
                                        minDate={new Date()}
                                        onDateChange={(date) => {
                                          const selectedDate = moment(date).format('YYYY-MM-DD');
                                          if (selectedDate >= moment(new Date()).format('YYYY-MM-DD')) {
                                            field.onChange(date)
                                            updateForm(index, {
                                              ...formValue,
                                              item_delivery_data: date,
                                            });
                                          } else {
                                            const dateValue = moment(field.value).format('YYYY-MM-DD');
                                            field.onChange(dateValue);
                                            updateForm(index, {
                                              ...formValue,
                                              item_delivery_data: dateValue,
                                            });
                                            showToast('Receipt date cannot be less than today', 'error');
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
                            <td className='w-1/4'>Claim Date</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.claim_date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <CustomDatePicker
                                        disabled={type === ReimburseFormType.edit}
                                        initialDate={
                                          field.value instanceof Date
                                            ? field.value
                                            : new Date(field.value)
                                        }
                                        minDate={new Date()}
                                        onDateChange={(date) => {
                                          const selectedDate = moment(date).format('YYYY-MM-DD');
                                          if (selectedDate >= moment(new Date()).format('YYYY-MM-DD')) {
                                            field.onChange(date)
                                            updateForm(index, {
                                              ...formValue,
                                              claim_date: date,
                                            });
                                          } else {
                                            const dateValue = moment(field.value).format('YYYY-MM-DD');
                                            field.onChange(dateValue);
                                            updateForm(index, {
                                              ...formValue,
                                              claim_date: dateValue,
                                            });
                                            showToast('Claim date cannot be less than today', 'error');
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
                            <td className='w-1/4'>Reimburse Cost</td>
                            <td className='w-full grid grid-cols-7 gap-x-4'>
                              <div className='col-span-3'>
                                <FormField
                                  control={form.control}
                                  name={`forms.${index}.currency`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Select
                                          disabled={type === ReimburseFormType.edit}
                                          onValueChange={(value) => {
                                            updateForm(index, {
                                              ...formValue,
                                              currency: value,
                                            });
                                          }}
                                          defaultValue={formValue.currency}
                                        >
                                          <SelectTrigger className='w-[200px]'>
                                            <SelectValue placeholder='-' />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {currencies.map((currency) => (
                                              <SelectItem key={currency.code} value={currency.code}>
                                                {currency.name} ({currency.code})
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </FormControl>
                                      <FormDescription className='h-6'></FormDescription>

                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className='col-span-4'>
                                <FormField
                                  control={form.control}
                                  name={`forms.${index}.balance`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type='text'
                                          placeholder='0'
                                          onChange={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const formattedValue = formatRupiah(rawValue, false);
                                            
                                            const currentBalance = parseInt(rawValue) || 0;
                                            const remainingBalance = detailLimit[index]?.balance || 0;

                                            if (currentBalance > remainingBalance) {
                                              e.target.value = formatRupiah(rawValue.slice(0, -1), false);
                                              return;
                                            }

                                            updateForm(index, {
                                              ...formValue,
                                              balance: rawValue,
                                            });
                                            e.target.value = formattedValue;

                                            const forms = form.getValues('forms');
                                            forms.forEach((formItem, idx) => {
                                              if (idx > index  && formItem.reimburse_type === formValue.reimburse_type) {
                                                const newRemainingBalance = remainingBalance - currentBalance;
                                                setDetailLimit((prev) => {
                                                  const newDetailLimit = [...prev];
                                                  newDetailLimit[idx] = {
                                                    ...newDetailLimit[idx],
                                                    balance: newRemainingBalance,
                                                  };
                                                  return newDetailLimit;
                                                });
                                                updateForm(idx, {
                                                  ...formValue,
                                                  balance: '',
                                                });
                                              }
                                            });
                                          }}
                                          defaultValue={formatRupiah(formValue.balance, false)}
                                          value={formatRupiah(formValue.balance, false)}
                                          disabled={typeof detailLimit[index] === 'undefined' || detailLimit[index]?.length === 0 || type === ReimburseFormType.edit}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td className='w-1/4'>File Attachment<span className='text-red-600'>*</span></td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.attachment`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className='text-xs text-gray-500 font-extralight mb-1'>
                                      Max File: 1000KB, Extension : jpg,jpeg,png,pdf,heic
                                    </FormLabel>
                                    <FormControl>
                                      <input
                                        className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                                        type='file'
                                        multiple
                                        accept='image/*,.pdf,.heic'
                                        onChange={(e) => {
                                          const files = e.target.files;
                                          if (files) {
                                            const updatedAttachments = [...formValue.attachment];
                                            const fileArray = Array.from(files);

                                            updatedAttachments.push(...fileArray);
                                            updateForm(index, {
                                              ...formValue,
                                              attachment: updatedAttachments,
                                            });
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className='mt-2'>
                                {formValue.attachment && formValue.attachment.length > 0 && (
                                  <ul>
                                    {formValue.attachment.map((file: File, fileIndex: number) => (
                                      <li key={fileIndex} className='flex justify-between items-center'>
                                        <span className='text-sm'>{file.name}</span>
                                        <button
                                          type='button'
                                          className='text-red-500 ml-2'
                                          onClick={() => {
                                            const updatedAttachments = formValue.attachment.filter((_, index) => index !== fileIndex);
                                            updateForm(index, {
                                              ...formValue,
                                              attachment: updatedAttachments,
                                            });
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
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
            {/* <WorkflowComponent /> */}
            <Separator className='my-4' />
            <div className='mt-4 flex justify-end'>
              <Button type='submit' className='w-32'>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CustomFormWrapper>
    </ScrollArea>
  );
};