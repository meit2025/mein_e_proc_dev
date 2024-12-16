import { useState, useEffect } from 'react';
import { Button } from '@/components/shacdn/button';
import { Button as ButtonMui } from '@mui/material';
import { Inertia } from '@inertiajs/inertia';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import {
  Form,
  FormControl,
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
import { Currency, Period, PurchasingGroup, User, Tax, CostCenter } from '../model/listModel';
import { FormType } from '@/lib/utils';
import useDropdownOptions from '@/lib/getDropdown';
import { AsyncDropdownComponent } from '@/components/commons/AsyncDropdownComponent';
import {
  GET_LIST_MASTER_REIMBUSE_TYPE,
  GET_LIST_PERIOD_MASTER_REIMBURSE,
  GET_LIST_EMPLOYEE_REIMBURSE,
  GET_LIST_FAMILY_REIMBURSE
} from '@/endpoint/reimburse/api';
import { CustomFormWrapper } from '@/components/commons/CustomFormWrapper';
import { set } from 'date-fns';
import {
  WorkflowApprovalDiagramInterface,
  WorkflowApprovalStepInterface,
  WorkflowComponent,
} from '@/components/commons/WorkflowComponent';

interface Props {
  onSuccess?: (value?: boolean) => void;
  purchasing_groups: PurchasingGroup[];
  currencies: Currency[];
  categories: string;
  periods: Period[];
  users: User[];
  taxes: Tax[];
  cost_center: CostCenter[];
  edit_url?: string;
  update_url?: string;
  store_url?: string;
  type?: FormType;
  currentUser?: User;
  latestPeriod: any;
}

export const ReimburseForm: React.FC<Props> = ({
  onSuccess,
  purchasing_groups,
  currencies,
  categories,
  periods,
  users,
  taxes,
  cost_center,
  edit_url,
  update_url,
  store_url,
  latestPeriod,
  type,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState('form1');
  const { showToast } = useAlert();
  const { errors } = usePage().props;
  const [formCount, setFormCount] = useState<number>(1);
  const { dataDropdown: dataUom, getDropdown: getUom } = useDropdownOptions();
  const { dataDropdown: dataEmployee, getDropdown: getEmployee } = useDropdownOptions(GET_LIST_EMPLOYEE_REIMBURSE);
  const [dataReimburseType, setDataReimburseType] = useState<any[]>([]);
  const [dataReimbursePeriod, setDataReimbursePeriod] = useState<any[]>([]);
  const [dataFamily, setDataFamily] = useState<any[]>([]);
  const [familyUrl, setFamilyUrl] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [detailLimit, setDetailLimit] = useState<any[]>([]);
  const [approvalRoute, setApprovalRoute] = useState({
    approvalRequest: [],
    approvalFrom: [],
    acknowledgeFrom: [],
  });

  const formSchema = z.object({
    formCount: z.string().min(1, 'total form must be have value'),
    remark_group: z.string().optional(),
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
        balance: z.string().min(1, 'balance required'),
        currency: z.string().min(1, 'currency required'),
        tax_on_sales: z.string().min(1, 'tax required'),
        purchase_requisition_unit_of_measure: z.string().min(1, 'uom required'),
        purchasing_group: z.string().min(1, 'Purchasing Group required'),
        period: z.string().min(1, 'period required'),
        type: z.any(),
        item_delivery_data: z.date(),
        start_date: z.date(),
        end_date: z.date(),
        attachments: z.any().optional(),
        // url: z.string().optional(),
      }),
    ),
  });

  // .min(1, 'reimburse type required')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formCount: '1',
      remark_group: 'test',
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
          currency: 'IDR',
          tax_on_sales: '',
          purchase_requisition_unit_of_measure: '',
          purchasing_group: '',
          period: '',
          type: '',
          item_delivery_data: new Date(),
          start_date: new Date(),
          end_date: new Date(),
          attachments: [],
          // url: '',
        },
      ],
    },
  });

  const { fields: formFields, update: updateForm } = useFieldArray({
    control: form.control,
    name: 'forms',
  });
  
  const handleFormCountChange = (value: any) => {
    setFormCount(value);
    const currentForms = form.getValues('forms');
    const newForms = Array.from({ length: value }).map((_, index) => {
      return (
        currentForms[index] || {
          reimburseId: '',
          for: '',
          group: '',
          reimburse_type: '',
          short_text: '',
          balance: '0',
          currency: 'IDR',
          tax_on_sales: '',
          purchasing_group: '',
          period: '',
          type: '',
          item_delivery_data: new Date(),
          start_date: new Date(),
          end_date: new Date(),
          attachments: []
        }
      );
    });
    form.setValue('forms', newForms);
    form.setValue('formCount', value.toString());
  };

  async function getDetailData() {
    form.setValue('forms', []);

    setLoading(true);

    try {
      const response = await axiosInstance.get(edit_url ?? '');
      const reimburseGroup = response.data.data.group;
      const reimburseForms = response.data.data.forms as [];
      
      const reimburseFormMapping = reimburseForms.map((map: any) => {
        return {
          reimburseId: String(map.id),
          for: String(map.for),
          group: String(map.group),
          reimburse_type: map.reimburse_type.code,
          short_text: map.short_text,
          balance: map.balance,
          currency: map.currency,
          tax_on_sales: String(map.tax_on_sales),
          purchase_requisition_unit_of_measure: String(map.purchase_requisition_unit_of_measure),
          purchasing_group: String(map.purchasing_group),
          period: map.period,
          type: map.type,
          item_delivery_data: new Date(map.item_delivery_data),
          start_date: new Date(map.start_date),
          end_date: new Date(map.end_date),
          attachments: '',
          // url: GET_LIST_MASTER_REIMBUSE_TYPE,
        };
      });

      form.setValue('formCount', reimburseForms.length.toString());
      form.setValue('remark_group', reimburseGroup.remark);
      form.setValue('cost_center', String(reimburseGroup.cost_center.id));
      form.setValue('requester', reimburseGroup.requester);

      let formCounter = 0;
      for (const map of reimburseForms) {
        await fetchReimburseType(formCounter, {type: map.type});
        await fetchReimbursePeriod(formCounter, {type: map.type, reimburse_type: map.reimburse_type.code});
        await fetchFamily(formCounter, {type: map.type, reimburse_type: map.reimburse_type.code, period: map.period});
        await getDataByLimit(formCounter, {period: map.period, reimburse_type: map.reimburse_type.code});
        formCounter++;
      }

      form.setValue('forms', reimburseFormMapping);
      setLoading(false);

    } catch (e) {
      const error = e as AxiosError;

      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (type === FormType.edit) {
      setLoading(true);
      getDetailData();
    }
  }, [type]);

  const handleSearchEmployee = async (query: string) => {
    if (query.length > 0) {
      getEmployee('', {
        name: 'name',
        id: 'nip',
        tabel: 'users'
      });
    }
  };

  useEffect(() => {
    getUom('', {
      name: 'unit_of_measurement_text',
      id: 'id',
      tabel: 'uoms',
    });

    getEmployee('', {
      name: 'name',
      id: 'nip',
      tabel: 'users'
    });
  }, []);

  const fetchReimburseType = async (index: number, otherParams: any) => {
    const response = await axiosInstance.get(GET_LIST_MASTER_REIMBUSE_TYPE, {
      params: {
        user                : form.getValues('requester'),
        familyRelationship  : otherParams.type
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
    if (query.length > 0) {
      try {
        const response = await axiosInstance.get(GET_LIST_MASTER_REIMBUSE_TYPE, {
          params: {
            search              : query,
            user                : form.getValues('requester'),
            familyRelationship  : form.getValues(`forms.${index}.type`)
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

  const fetchReimbursePeriod = async (index: number, otherParams: any) => {
      // get data reimburse period
      const response = await axiosInstance.get(GET_LIST_PERIOD_MASTER_REIMBURSE, {
        params: {
          user                : form.getValues('requester'),
          familyRelationship  : otherParams.type,
          reimburseType       : otherParams.reimburse_type
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setDataReimbursePeriod((prev) => {
        const newData = [...prev];
        newData[index] = response.data.data;
        return newData;
      });
  };

  const fetchFamily = async (index: number, otherParams: any) => {
    // get data family
    const response = await axiosInstance.get(GET_LIST_FAMILY_REIMBURSE, {
      params: {
        user                : form.getValues('requester'),
        familyRelationship  : otherParams.type,
        reimburseType       : otherParams.reimburse_type,
        reimbursePeriod     : otherParams.period
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    setDataFamily((prev) => {
      const newData = [...prev];
      newData[index] = response.data.data;
      return newData;
    });
};

  useEffect(() => {
    for (let index = 0; index < formFields.length; index++) {
      let requester           = form.getValues('requester');
      let familyRelationship  = form.getValues(`forms.${index}.type`);
      
      if (requester || familyRelationship) fetchReimburseType(index, {type: familyRelationship});
    }
  }, [formFields.length, form.watch('forms')]);

  const employeeTriggreOtheDropwdownRelation = () => {
    for (let index = 0; index < formFields.length; index++) {
      form.setValue(`forms.${index}.reimburse_type`, '');
      form.setValue(`forms.${index}.period`, '');
      form.setValue(`forms.${index}.for`, '');
      setDetailLimit((prev) => {
        const newDetailLimit = [...prev];
        newDetailLimit.splice(index, 1)
        return newDetailLimit;
      });
    }
  };
  
  function generateForms(count: string) {
    const forms = [...form.getValues('forms')];
    for (let i = 0; i < parseInt(count); i++) {
      if (i + 1 > forms.length) {
        const object = {
          reimburseId: '',
          for: '',
          group: '',
          reimburse_type: '',
          short_text: '',
          balance: '',
          currency: 'IDR',
          tax_on_sales: '',
          purchase_requisition_unit_of_measure: '',
          purchasing_group: '',
          period: '',
          type: '',
          item_delivery_data: new Date(),
          start_date: new Date(),
          end_date: new Date(),
          attachments: []
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
        // if (parseInt(detailLimit[index]?.limit) < formLength) {
        //   showToast('Limit '+index+' has been reached', 'error');
        //   return;
        // }

        const allBalances = values.forms.reduce((acc, curr) => {
          return acc + parseInt(curr.balance);
        }, 0);

        // if (parseInt(detailLimit[index]?.balance ?? 0) < allBalances) {
        //   showToast(
        //     'Please check your balance input in forms is not must be above ' + detailLimit[index]?.balance,
        //     'error',
        //   );
        //   return;
        // }
      }
    }
    const totalNominal = values.forms.reduce((acc, item) => acc + parseInt(item.balance) || 0, 0);

    values.value = totalNominal;
    values.user_id = values?.requester || '0';
    try {
      let response;
      if (type === FormType.edit) {
        response = await axiosInstance.put(update_url ?? '', values);
      } else {
        response = await axiosInstance.post(store_url ?? '', values);
      }
      showToast(response?.data?.data, 'success');
      onSuccess();
    } catch (e) {
      const error = e as AxiosError;

      console.log(error);
    }
  };

  async function getDataByLimit(index: number, param:any = null) {
    const data = form.getValues(`forms.${index}`);
    const params = {
      user: form.getValues('requester'),
      periode: param != null ? param.period : data.period,
      reimbuse_type_id: param != null ? param.reimburse_type : data.reimburse_type,
    };
    try {
      const response = await axiosInstance.get('reimburse/data-limit-and-balance', {
        params: params,
      });

      setDetailLimit((prev) => {
        const newData = [...prev];
        newData[index] = response.data.data;
        return newData;
      });
    } catch (e) {
      console.log(e);
      showToast(e?.response?.data?.message, 'error');
    }
  }

  const fetchDataValue = async () => {
    try {
      const values = form.getValues('forms');
      const totalNominal = values.reduce((acc, item) => acc + parseInt(item.balance) || 0, 0);

      if (totalNominal === 0) {
        showToast('Please fill the balance', 'error');
        return;
      }

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
            <table className='text-xs mt-4 reimburse-form-table font-thin'>
              <tbody>
                <tr>
                  <td className="w-1/4">Reimburse Request No.</td>
                  <td>{form?.code ?? '-'}</td>
                </tr>
                <tr>
                  <td className="w-1/4">Request Status</td>
                  {/* <td>{reimbursement?.status ?? '-'}</td> */}
                </tr>
                <tr>
                  <td className="w-1/4">Remark</td>
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
                  <td className="w-1/4">Cost Center</td>
                  <td>
                    <FormField
                      control={form.control}
                      name='cost_center'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              disabled={type === FormType.edit}
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value}
                            >
                              <SelectTrigger className='w-[200px]'>
                                <SelectValue placeholder='-' />
                              </SelectTrigger>
                              <SelectContent>
                                {cost_center.map((value) => (
                                  <SelectItem key={value.id} value={value.id.toString()}>
                                    {value.cost_center}
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
                  <td className="w-1/4">Employee</td>
                  <td>
                    <FormAutocomplete<any>
                      options={dataEmployee}
                      fieldName='requester'
                      isRequired={true}
                      disabled={type === FormType.edit}
                      placeholder={'Select Employee'}
                      onSearch={handleSearchEmployee}
                      onChangeOutside={() => employeeTriggreOtheDropwdownRelation()}
                      classNames='mt-2 w-full'
                    />
                  </td>
                </tr>
                <tr>
                  <td className="w-1/4">Number of Forms</td>
                  <td>
                    <FormField
                      control={form.control}
                      name='formCount'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              disabled={type === FormType.edit}
                              onValueChange={(value) => {
                                field.onChange(value);
                                generateForms(value);
                              }}
                              value={field.value?.toString()}
                            >
                              <SelectTrigger className='w-[200px]'>
                                <SelectValue placeholder='Select number of forms' />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
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
                            <td className="w-1/4">Type of Reimbursement </td>
                            <td className='flex items-center space-x-3'>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.type`}
                                render={({ field }) => (
                                  <Select
                                    disabled={type === FormType.edit}
                                    onValueChange={(value) => {
                                      updateForm(index, {
                                        ...formValue,
                                        type            : String(value)
                                      });

                                      form.setValue(`forms.${index}.reimburse_type`, '');
                                      form.setValue(`forms.${index}.period`, '');
                                      form.setValue(`forms.${index}.for`, '');
                                      setDetailLimit((prev) => {
                                        const newDetailLimit = [...prev];
                                        newDetailLimit.splice(index, 1)
                                        return newDetailLimit;
                                      });
                                    }}
                                    defaultValue={formValue.type}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select Family Relationship' />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              
                              <FormAutocomplete<any>
                                options={dataReimburseType[index]}
                                fieldName={`forms.${index}.reimburse_type`}
                                isRequired={true}
                                disabled={form.getValues(`forms.${index}.type`) == '' || form.getValues('requester') == '' || type === FormType.edit}
                                placeholder={'Select Reimburse Type'}
                                onChangeOutside={(query: string, data: any) => {
                                  const currentRequester = form.getValues('requester');
                                  const currentType = form.getValues(`forms.${index}.type`);
                                  if (query !== data?.value && currentRequester !== '' && currentType !== '') handleSearchReimburseType(query, index);
                                  
                                  if (data?.value) {
                                    updateForm(index, {
                                      ...formValue,
                                      reimburse_type  : data?.value
                                    });
                                    
                                    fetchReimbursePeriod(index, {type: form.getValues(`forms.${index}.type`), reimburse_type: data.value});
                                  }

                                  form.setValue(`forms.${index}.period`, '');
                                  form.setValue(`forms.${index}.for`, '');
                                  setDetailLimit((prev) => {
                                    const newDetailLimit = [...prev];
                                    newDetailLimit.splice(index, 1)
                                    return newDetailLimit;
                                  });
                                  
                                }}
                                onFocus={() => fetchReimburseType(index, {type: form.getValues(`forms.${index}.type`)})}
                                classNames='mt-2 w-full'
                              />
                            </td>
                          </tr>

                          <tr>
                            <td className="w-1/4">Purchasing Group</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.purchasing_group`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        disabled={type === FormType.edit}
                                        onValueChange={(value) => {
                                          updateForm(index, {
                                            ...formValue,
                                            purchasing_group: String(value),
                                          });
                                        }}
                                        defaultValue={formValue.purchasing_group}
                                      >
                                        <SelectTrigger className='w-[200px]'>
                                          <SelectValue placeholder='-' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {purchasing_groups.map((value) => (
                                            <SelectItem key={value.id} value={value.id.toString()}>
                                              {value.purchasing_group_desc} -{' '}
                                              {value.purchasing_group}
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
                            <td className="w-1/4">Period Date</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.period`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        disabled={form.getValues(`forms.${index}.reimburse_type`) == '' || type === FormType.edit}
                                        onValueChange={(value) => {
                                          updateForm(index, {
                                            ...formValue,
                                            period  : value
                                          });
                                          if (form.getValues(`forms.${index}.type`) == 'Employee') {
                                            getDataByLimit(index);
                                          } else {
                                            setDetailLimit((prev) => {
                                              const newDetailLimit = [...prev];
                                              newDetailLimit.splice(index, 1)
                                              return newDetailLimit;
                                            });
                                          }
                                          fetchFamily(index, {type: form.getValues(`forms.${index}.type`), reimburse_type: form.getValues(`forms.${index}.reimburse_type`), period: value})
                                          form.setValue(`forms.${index}.for`, '');
                                        }}
                                        defaultValue={formValue.period}
                                      >
                                        <SelectTrigger className='w-[200px]'>
                                          <SelectValue placeholder='-' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {dataReimbursePeriod[index]?.map((period) => (
                                            <SelectItem key={period.value} value={period.value}>
                                              {period.label}
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
                            <td className="w-1/4">Family {/*formValue.for*/}</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.for`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        disabled={form.getValues(`forms.${index}.type`) !== 'Family' || type === FormType.edit}
                                        onValueChange={(value) =>
                                          {
                                            updateForm(index, {
                                              ...formValue,
                                              for: value,
                                            });
                                            if (form.getValues(`forms.${index}.type`) == 'Family') getDataByLimit(index);
                                          }
                                        }
                                        defaultValue={formValue?.for}
                                      >
                                        <SelectTrigger className='w-[200px]'>
                                          <SelectValue placeholder='-' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {dataFamily[index]?.map((family) => (
                                            <SelectItem key={family.value} value={family.value.toString()}>
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
                            <td className="w-1/4">Tax</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.tax_on_sales`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        disabled={type === FormType.edit}
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
                                          {taxes.map((tax) => (
                                            <SelectItem key={tax.id} value={tax.id.toString()}>
                                              {tax.mwszkz}
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
                            <td className="w-1/4">Uom</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.purchase_requisition_unit_of_measure`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        disabled={type === FormType.edit}
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
                                              {uom.label}
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
                            <td className="w-1/4">Remark</td>
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
                            <td className="w-1/4">Sisa Balance</td>
                            <td>
                              <span className='font-bold'>{detailLimit[index]?.balance}</span>
                            </td>
                          </tr>

                          <tr>
                            <td className="w-1/4">Sisa Limit</td>
                            <td>
                              <span className='font-bold'>{detailLimit[index]?.limit}</span>{' '}
                            </td>
                          </tr>

                          <tr>
                            <td className="w-1/4">Receipt Date</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.item_delivery_data`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <CustomDatePicker
                                        disabled={type === FormType.edit}
                                        initialDate={
                                          field.value instanceof Date
                                            ? field.value
                                            : new Date(field.value)
                                        }
                                        onDateChange={(date) => field.onChange(date)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </td>
                          </tr>

                          <tr>
                            <td className="w-1/4">Claim date</td>
                            <td className='flex items-center'>
                              {/* <CustomDatePicker /> */}
                              <span className='mx-2'>Start Date</span>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.start_date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <CustomDatePicker
                                        disabled={type === FormType.edit}
                                        initialDate={
                                          field.value instanceof Date
                                            ? field.value
                                            : new Date(field.value)
                                        }
                                        onDateChange={(date) => field.onChange(date)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <span className='mx-2'>End Date</span>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.end_date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <CustomDatePicker
                                        disabled={type === FormType.edit}
                                        initialDate={
                                          field.value instanceof Date
                                            ? field.value
                                            : new Date(field.value)
                                        }
                                        onDateChange={(date) => field.onChange(date)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </td>
                          </tr>

                          <tr>
                            <td className="w-1/4">Reimburse Cost</td>
                            <td className='w-full grid grid-cols-7 gap-x-4'>
                              <div className='col-span-3'>
                                <FormField
                                  control={form.control}
                                  name={`forms.${index}.currency`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Select
                                          disabled={type === FormType.edit}
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
                                            updateForm(index, {
                                              ...formValue,
                                              balance: rawValue,
                                            });
                                            e.target.value = formattedValue;
                                          }}
                                          defaultValue={formValue.balance}
                                          disabled={type === FormType.edit}
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
                            <td className="w-1/4">Attachments</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.attachments`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <input
                                        type='file'
                                        multiple
                                        accept='image/*,.pdf,.doc,.docx'
                                        onChange={(e) => {
                                          let files = Array.from(e.target.files)[0];
                                          console.log(e.target);
                                          if (files) {
                                            alert('asdas')
                                            updateForm(index, {
                                              ...formValue,
                                              attachments: files,
                                            });
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
                    approvalRoute.approvalFrom as unknown as WorkflowApprovalStepInterface
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
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CustomFormWrapper>
    </ScrollArea>
  );
};