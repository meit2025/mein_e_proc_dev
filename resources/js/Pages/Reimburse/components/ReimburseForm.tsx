import { useState, useEffect } from 'react';
import { Button } from '@/components/shacdn/button';
import { Inertia } from '@inertiajs/inertia';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { CustomDatePicker } from '@/components/commons/CustomDatePicker';
import { Input } from '@/components/shacdn/input';
import { useAlert } from '../../../contexts/AlertContext.jsx';
import { usePage } from '@inertiajs/react';
import { Currency, Period, PurchasingGroup, User, Tax, CostCenter } from '../model/listModel';
import { FormType } from '@/lib/utils';
import useDropdownOptions from '@/lib/getDropdown';
import { AsyncDropdownComponent } from '@/components/commons/AsyncDropdownComponent';
import { GET_LIST_MASTER_REIMBUSE_TYPE } from '@/endpoint/reimburse/api';
import { CustomFormWrapper } from '@/components/commons/CustomFormWrapper';
import { set } from 'date-fns';

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
  const [limits, setLimits] = useState([]);
  const [reimburseTypes, setReimburseTypes] = useState([[]]);
  const [requester, setRequester] = useState();
  const [families, setFamilies] = useState([]);
  const [isFamily, setIsFamily] = useState([[]]);
  const { dataDropdown: dataUom, getDropdown: getUom } = useDropdownOptions();
  const [familyUrl, setFamilyUrl] = useState('');

  const [isLoading, setLoading] = useState<boolean>(false);
  const [detailLimit, setDetailLimit] = useState<any>(null);

  const formSchema = z.object({
    formCount: z.string().min(1, 'total form must be have value'),
    remark_group: z.string().optional(),
    cost_center: z.string().min(1, 'cost center required'),
    requester: z.string().min(1, 'requester required'),
    forms: z.array(
      z.object({
        id: z.string().optional(),
        for: z.string().optional(),
        group: z.string().optional(),
        reimburse_type: z.string().min(1, 'reimburse type is required'),
        short_text: z.string().min(1, 'remarks is required'),
        balance: z.string().min(1, 'balance required'),
        currency: z.string().min(1, 'currency required'),
        tax_on_sales: z.string().min(1, 'tax required'),
        uom: z.string().min(1, 'uom required'),
        purchasing_group: z.string().min(1, 'Purchasing Group required'),
        period: z.string().min(1, 'period required'),
        type: z.any(),
        item_delivery_data: z.date(),
        start_date: z.date(),
        end_date: z.date(),
        url: z.string().optional(),
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
          id: '',
          for: '',
          group: '',
          reimburse_type: '',
          short_text: '',
          balance: '',
          currency: 'IDR',
          tax_on_sales: '',
          uom: '',
          purchasing_group: '',
          period: latestPeriod,
          type: '',
          item_delivery_data: new Date(),
          start_date: new Date(),
          end_date: new Date(),
          url: '',
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
          id: '',
          for: '',
          group: '',
          reimburse_type: '',
          short_text: '',
          balance: '0',
          currency: 'IDR',
          tax_on_sales: '',
          purchasing_group: '',
          period: latestPeriod['code'],
          type: '',
          item_delivery_data: new Date(),
          start_date: new Date(),
          end_date: new Date(),
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
          id: String(map.id),
          for: map.form,
          group: String(map.group),
          reimburse_type: map.reimburse_type,
          short_text: map.short_text,
          balance: map.balance,
          currency: map.currency,
          tax_on_sales: String(map.tax_on_sales),
          uom: String(map.uom),
          purchasing_group: String(map.purchasing_group),
          period: map.period,
          type: map.type,
          item_delivery_data: new Date(map.item_delivery_data),
          start_date: new Date(map.start_date),
          end_date: new Date(map.end_date),
          url: GET_LIST_MASTER_REIMBUSE_TYPE(map.type),
        };
      });
      form.setValue('formCount', reimburseForms.length);
      form.setValue('remark_group', reimburseGroup.remark_group);
      form.setValue('cost_center', String(reimburseGroup.cost_center));
      form.setValue('requester', reimburseGroup.requester);

      form.setValue('forms', reimburseFormMapping);
      setLoading(false);

      // consoel.log(form.getValues('forms'), 'get data forms');
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

  useEffect(() => {
    getUom('', {
      name: 'unit_of_measurement_text',
      id: 'id',
      tabel: 'uoms',
    });
  }, []);

  function generateForms(count: string) {
    const forms = [];
    for (let i = 0; i < parseInt(count); i++) {
      const object = {
        id: '',
        for: '',
        group: '',
        reimburse_type: '',
        short_text: '',
        balance: '',
        currency: '',
        tax_on_sales: '',
        uom: '',
        purchasing_group: '',
        period: latestPeriod['code'],
        type: '',
        item_delivery_data: new Date(),
        start_date: new Date(),
        end_date: new Date(),
        url: '',
      };

      forms.push(object);
    }

    // console.log(forms);

    form.setValue('forms', forms);
  }

  const selectedEmployee = async (value: any) => {
    try {
      const response = await axiosInstance.get(`/family/show/${value}`);
      const typeData = response.data;
      setFamilies(typeData);
      setRequester(value);
      form.setValue('requester', value);
    } catch (error) {
      const resultError = error as AxiosError;
      const err = resultError.response.data;
      showToast(err.message, 'error');
    }
  };

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  async function selectedTypeCode(index, value) {
    updateForm(index, {
      ...formFields[index],
      type: value,
      url: GET_LIST_MASTER_REIMBUSE_TYPE(value),
      reimburse_type: '',
    });
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (detailLimit) {
      if (parseInt(detailLimit?.limit) < values.forms.length) {
        showToast('Limit has been reached', 'error');

        return;
      }

      const allBalances = values.forms.reduce((acc, curr) => {
        return acc + parseInt(curr.balance);
      }, 0);

      if (parseInt(detailLimit?.balance ?? 0) < allBalances) {
        showToast(
          'Please check your balance input in forms is not must be above ' + detailLimit?.balance,
          'error',
        );
        return;
      }
    }
    try {
      const response = await axiosInstance.post(store_url ?? '', values);

      console.log(values);

      showToast('succesfully created data', 'success');

      onSuccess();
    } catch (e) {
      const error = e as AxiosError;

      console.log(error);
    }
  };

  async function getDataByLimit(index: number) {
    const data = form.getValues(`forms.${index}`);
    const grade_option = console.log(data);
    const params = {
      user: currentUser?.nip,
      periode: data.period,
      reimbuse_type_id: data.reimburse_type,
    };
    try {
      const response = await axiosInstance.get('reimburse/data-limit-and-balance', {
        params: params,
      });

      setDetailLimit(response.data.data);
    } catch (e) {
      console.log(e);
    }
  }

  // /data-limit-and-balance

  return (
    <ScrollArea className='h-[600px] w-full'>
      <CustomFormWrapper isLoading={isLoading}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <table className='text-xs mt-4 reimburse-form-table font-thin'>
              <tbody>
                <tr>
                  <td width={200}>Reimburse Request No.</td>
                  <td>{form?.code ?? '-'}</td>
                </tr>
                <tr>
                  <td width={200}>Request Status</td>
                  {/* <td>{reimbursement?.status ?? '-'}</td> */}
                </tr>
                <tr>
                  <td width={200}>Remark</td>
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
                  <td width={200}>Cost Center</td>
                  <td>
                    <FormField
                      control={form.control}
                      name='cost_center'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
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
                  <td width={200}>Employee</td>
                  <td>
                    <FormField
                      control={form.control}
                      name='requester'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={(value) => selectedEmployee(value)}
                              value={field.value}
                            >
                              <SelectTrigger className='w-[200px]'>
                                <SelectValue placeholder='Requester' />
                              </SelectTrigger>
                              <SelectContent>
                                {currentUser?.is_admin === 1 ? (
                                  <>
                                    {users.map((user) => (
                                      <SelectItem key={user.nip} value={user.nip}>
                                        {user.name} [{user.nip}]
                                      </SelectItem>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    <SelectItem key={currentUser.nip} value={currentUser.nip}>
                                      {currentUser.name} [{currentUser.nip}]
                                    </SelectItem>
                                  </>
                                )}
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
                  <td width={200}>Number of Forms</td>
                  <td>
                    <FormField
                      control={form.control}
                      name='formCount'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
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
                      name={`forms.${index}.id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className='sr-only'
                              value={field.value}
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
                            <td width={200}>Type of Reimbursement </td>
                            <td className='flex items-center space-x-3'>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.type`}
                                render={({ field }) => (
                                  <Select
                                    onValueChange={(value) => selectedTypeCode(index, value)}
                                    defaultValue={formValue.type}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select type' />
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

                              <FormField
                                control={form.control}
                                name={`forms.${index}.reimburse_type`}
                                render={({ field }) => (
                                  // <Select
                                  //   disabled={
                                  //     !reimburseTypes[index] || reimburseTypes[index].length === 0
                                  //   }
                                  //   onValueChange={
                                  //     (value) => {
                                  //       updateForm(index, {
                                  //         ...formValue,
                                  //         reimburse_type: value,
                                  //       });
                                  //     }

                                  //     // field.onChange(value)
                                  //   }
                                  //   defaultValue={formValue.reimburse_type}
                                  // >
                                  //   <SelectTrigger>
                                  //     <SelectValue placeholder='Select detail' />
                                  //   </SelectTrigger>
                                  //   <SelectContent>
                                  //     {reimburseTypes[index] &&
                                  //       reimburseTypes[index].map((reimburseType) => (
                                  //         <SelectItem
                                  //           key={reimburseType.code}
                                  //           value={reimburseType.code}
                                  //         >
                                  //           {reimburseType.name}
                                  //         </SelectItem>
                                  //       ))}
                                  //   </SelectContent>
                                  // </Select>
                                  <AsyncDropdownComponent
                                    disabled={formValue.type === ''}
                                    onSelectChange={(value) => {
                                      updateForm(index, {
                                        ...formValue,
                                        reimburse_type: value,
                                      });
                                    }}
                                    value={formValue.reimburse_type}
                                    placeholder='Select Reimbuse Type'
                                    filter={['name']}
                                    id='code'
                                    label='name'
                                    defaultLabel={formValue.reimburse_type}
                                    url={formValue.url}
                                  />
                                )}
                              />
                            </td>
                          </tr>

                          <tr>
                            <td width={200}>Purchasing Group</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.purchasing_group`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        onValueChange={(value) => {
                                          updateForm(index, {
                                            ...formValue,
                                            purchasing_group: value,
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
                            <td width={200}>Period Date</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.period`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        onValueChange={(value) => {
                                          updateForm(index, {
                                            ...formValue,
                                            period: value,
                                          });
                                          getDataByLimit(index);
                                        }}
                                        defaultValue={formValue.period}
                                      >
                                        <SelectTrigger className='w-[200px]'>
                                          <SelectValue placeholder='-' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {/* {periods.map((period) => (
                                          <SelectItem key={period.code} value={period.code}>
                                            {period.start} - {period.end} ({period.code})
                                          </SelectItem>
                                        ))} */}

                                          <SelectItem
                                            key={latestPeriod?.code}
                                            value={latestPeriod?.code}
                                          >
                                            {latestPeriod?.start} - {latestPeriod?.end} (
                                            {latestPeriod?.code})
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </td>
                          </tr>

                          {formValue.type === 'Family' ? (
                            <tr>
                              <td width={200}>Family {formValue.for}</td>
                              <td>
                                <FormField
                                  control={form.control}
                                  name={`forms.${index}.for`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        {/* <Select
                                        // disabled={!isFamily[index] || isFamily[index].length === 0}
                                        onValueChange={(value) =>
                                          checkBalance(
                                            index,
                                            value,
                                            !isFamily[index],
                                            form.getValues(`forms.${index}.reimburse_type`),
                                            form.getValues(`forms.${index}.period`),
                                          )
                                        }
                                        value={field.value}
                                      >
                                        <SelectTrigger className='w-[200px]'>
                                          <SelectValue placeholder='-' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {families.map((family) => (
                                            <SelectItem
                                              key={family.id}
                                              value={family.id.toString()}
                                            >
                                              {family.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select> */}

                                        <AsyncDropdownComponent
                                          disabled={formValue.type === ''}
                                          onSelectChange={(value) => {
                                            updateForm(index, {
                                              ...formValue,
                                              for: String(value),
                                            });
                                          }}
                                          value={formValue.for}
                                          placeholder='Select Family'
                                          filter={['name']}
                                          id='id'
                                          label='name'
                                          url={`reimburse/get-data-family/` + currentUser.id}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </td>
                            </tr>
                          ) : null}

                          <tr>
                            <td width={200}>Tax</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.tax_on_sales`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
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
                            <td width={200}>Uom</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.uom`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select
                                        onValueChange={(value) => {
                                          updateForm(index, {
                                            ...formValue,
                                            uom: value,
                                          });
                                        }}
                                        defaultValue={formValue.uom}
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
                            <td width={200}>Remark</td>
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
                            <td width={200}>Sisa Balance</td>
                            <td>
                              <span className='font-bold'>{detailLimit?.balance}</span>
                            </td>
                          </tr>

                          <tr>
                            <td width={200}>Sisa Limit</td>
                            <td>
                              <span className='font-bold'>{detailLimit?.limit}</span>{' '}
                            </td>
                          </tr>

                          <tr>
                            <td width={200}>Receipt Date</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.item_delivery_data`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <CustomDatePicker
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
                            <td width={200}>Claim date</td>
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
                            <td width={200}>Reimburse Cost</td>
                            <td className='w-full grid grid-cols-7 gap-x-4'>
                              <div className='col-span-3'>
                                <FormField
                                  control={form.control}
                                  name={`forms.${index}.currency`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Select
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
                                          type='number'
                                          placeholder='0.0'
                                          onChange={(e) => {
                                            updateForm(index, {
                                              ...formValue,
                                              balance: e.target.value,
                                            });
                                          }}
                                          defaultValue={formValue.balance}
                                        />
                                      </FormControl>

                                      {/* <FormDescription className='h-6'>
                                      {parseInt(detailLimit?.balance ?? 0) <
                                      parseInt(formValue.balance) ? (
                                        <span className='text-red-500'>
                                          Reimbuse cost must be not greather than balance
                                        </span>
                                      ) : null}
                                    </FormDescription> */}

                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td width={200}>Attachments</td>
                            <td>
                              <FormField
                                control={form.control}
                                name={`forms.${index}.attachment`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <input
                                        type='file'
                                        multiple
                                        accept='image/*,.pdf,.doc,.docx'
                                        onChange={(e) => {
                                          const files = e.target.files;
                                          if (files) {
                                            const fileArray = Array.from(files);
                                            field.onChange(fileArray);
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
