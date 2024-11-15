import { useState, useEffect } from 'react';
import { Button } from '@/components/shacdn/button';
import { Inertia } from '@inertiajs/inertia';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/shacdn/form';
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

interface Props {
  onSuccess?: (value: boolean) => void;
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

  const formSchema = z.object({
    formCount: z.string().min(1, 'total form must be have value'),
    remark_group: z.string().optional(),
    cost_center: z.string().min(1, 'cost center required'),
    requester: z.string().min(1, 'requester required'),
    forms: z.array(
      z.object({
        // id: z.string().optional(),
        // for: z.string().optional(),
        // group: z.string().optional(),
        // reimburse_type: z.string().min(1, 'reimburse type required'),
        // short_text: z.string().optional(),
        // balance: z.string().optional(),
        // currency: z.string().optional(),
        // tax_on_sales: z.string().optional(),
        // uom: z.string().optional(),
        // purchasing_group: z.string().optional(),
        // period: z.string().optional(),
        // type: z.string().optional(),
        // item_delivery_data: z.date(),
        // start_date: z.date(),
        // end_date: z.date(),
      }),
    ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formCount: '1',
      remark_group: 'test',
      cost_center: 'test',
      requester: '',
      forms: Array.from({ length: 1 }).map(() => ({
        id: '',
        for: '',
        group: '',
        reimburse_type: '',
        short_text: '',
        balance: 0,
        currency: 'IDR',
        tax_on_sales: '',
        uom: '',
        purchasing_group: '',
        period: '',
        type: '',
        item_delivery_data: new Date(),
        start_date: new Date(),
        end_date: new Date(),
      })),
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
          balance: 0,
          currency: 'IDR',
          tax_on_sales: '',
          purchasing_group: '',
          period: '',
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
    try {
      const response = await axiosInstance.get(edit_url);
      const data = response.data.data[0];
      form.setValue('remark_group', data.remark);
      form.setValue('cost_center', data.cost_center);
      form.setValue('requester', data.users.nip);
      form.setValue('formCount', data.reimburses.length.toString());
      form.setValue(
        'forms',
        data.reimburses.map((reimburse) => ({
          id: reimburse.id,
          for: reimburse.for,
          group: reimburse.group,
          reimburse_type: reimburse.reimburse_type,
          short_text: reimburse.short_text,
          balance: Number(reimburse.balance),
          currency: reimburse.currency,
          tax_on_sales: reimburse.tax_on_sales,
          purchasing_group: reimburse.purchasing_group,
          period: reimburse.period,
          type: reimburse.type,
          item_delivery_data: new Date(reimburse.item_delivery_data),
          start_date: new Date(reimburse.start_date),
          end_date: new Date(reimburse.end_date),
        })),
      );
      data.reimburses.forEach((reimburse, index) => {
        selectedTypeCode(index, reimburse.reimburse_type);
      });
    } catch (e) {
      const error = e as AxiosError;
      showToast(error, 'error');
    }
  }

  useEffect(() => {
    if (type === FormType.edit) {
      getDetailData();
    }
  });

  useEffect(() => {
    getUom('', {
      name: 'unit_of_measurement_text',
      id: 'id',
      tabel: 'uoms',
    });
  }, []);

  function generateForms() {
    const forms = [];
    for (let i = 0; i < parseInt(form.getValues('formCount')); i++) {
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
        period: '',
        type: '',
        item_delivery_data: new Date(),
        start_date: new Date(),
        end_date: new Date(),
      };
    }
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
    try {
      const response = await axiosInstance.get(`reimburse/type/${value}` ?? '');
      const typeData = response.data.data;
      setReimburseTypes((prevTypes) => {
        const updatedTypes = [...prevTypes];
        updatedTypes[index] = typeData;
        return updatedTypes;
      });
      setIsFamily((prevIsFamily) => {
        const updatedIsFamily = [...prevIsFamily];
        updatedIsFamily[index] = value === 'Family';
        return updatedIsFamily;
      });
      updateForm(index, {
        ...formFields[index],
        type: value,
      });
    } catch (error) {
      const resultError = error as AxiosError;
      const err = resultError.response.data;
      showToast(err.message, 'error');
    }
  }

  const checkBalance = async (index, user, is_employee, type, period) => {
    const response = await axiosInstance.post('/reimburse/is_required', {
      user,
      is_employee,
      type,
      period,
    });
    const selectedType = response.data.data;
    setLimits((prevLimits) => {
      const updatedLimits = [...prevLimits];
      updatedLimits[index] = {
        plafon: selectedType?.plafon,
        limit: selectedType?.limit,
      };
      return updatedLimits;
    });
    form.setValue(`forms.${index}.for`, user);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axiosInstance.post(store_url ?? '', values);

      console.log(values);

      showToast('succesfully created data', 'success');

      // onSuccess?.(true);
    } catch (e) {
      const error = e as AxiosError;

      console.log(error);
    }
  };

  useEffect(() => {
    generateForms();
  }, [form.getValues('formCount')]);

  return (
    <ScrollArea className='h-[600px] w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <table className='text-xs mt-4 reimburse-form-table font-thin'>
            <tbody>
              <tr>
                <td width={200}>Reimburse Request No.</td>
                {/* <td>{reimbursement?.request_number ?? '-'}</td> */}
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
                              {users.map((user) => (
                                <SelectItem key={user.nip} value={user.nip}>
                                  {user.name} [{user.nip}]
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
                <td width={200}>Number of Forms</td>
                <td>
                  <FormField
                    control={form.control}
                    name='formCount'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={(value) => handleFormCountChange(value)}
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

            {formFields.map((form: any, index: number) => {
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

                  {form.type}
                  <div>
                    <table className='text-xs mt-4 reimburse-form-detail font-thin'>
                      <tbody>
                        <tr>
                          <td width={200}>Type of Reimbursement</td>
                          <td className='flex items-center space-x-3'>
                            <FormField
                              control={form.control}
                              name={`forms.${index}.type`}
                              render={({ field }) => (
                                <Select
                                  onValueChange={(value) => selectedTypeCode(index, value)}
                                  defaultValue={form.type}
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
                                <Select
                                  disabled={
                                    !reimburseTypes[index] || reimburseTypes[index].length === 0
                                  }
                                  onValueChange={(value) =>
                                    // form.setValue(`forms.${index}.reimburse_type`, value)

                                    updateForm(index, {
                                      ...formFields[index],
                                      reimburse_type: value,
                                    })
                                  }
                                  defaultValue={form.reimburse_type}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select detail' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {reimburseTypes[index] &&
                                      reimburseTypes[index].map((reimburseType) => (
                                        <SelectItem
                                          key={reimburseType.code}
                                          value={reimburseType.code}
                                        >
                                          {reimburseType.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
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
                                      onValueChange={(value) => field.onChange(value)}
                                      value={field.value}
                                    >
                                      <SelectTrigger className='w-[200px]'>
                                        <SelectValue placeholder='-' />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {purchasing_groups.map((value) => (
                                          <SelectItem key={value.id} value={value.id.toString()}>
                                            {value.purchasing_group_desc} - {value.purchasing_group}
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
                                      onValueChange={(value) => field.onChange(value)}
                                      value={field.value}
                                    >
                                      <SelectTrigger className='w-[200px]'>
                                        <SelectValue placeholder='-' />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {periods.map((period) => (
                                          <SelectItem key={period.code} value={period.code}>
                                            {period.start} - {period.end} ({period.code})
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

                        {form.type === 'Family' ? (
                          <tr>
                            <td width={200}>Family</td>
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
                                        onSelectChange={(value) => {
                                          field.onChange(value);
                                        }}
                                        value={field.value}
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
                                      onValueChange={(value) => field.onChange(value)}
                                      value={field.value}
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
                                      onValueChange={(value) => field.onChange(value)}
                                      value={field.value}
                                    >
                                      <SelectTrigger className='w-[200px]'>
                                        <SelectValue placeholder='-' />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {(dataUom ?? []).map((uom, index) => (
                                          <SelectItem key={uom.value} value={uom.value.toString()}>
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
                                    <Textarea placeholder='Insert remark' {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td width={200}>Balance</td>
                          <td>{limits[index]?.plafon}</td>
                        </tr>

                        <tr>
                          <td width={200}>Limit per claim</td>
                          <td>{limits[index]?.limit}</td>
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
                          <td className='flex items-center space-x-3'>
                            <FormField
                              control={form.control}
                              name={`forms.${index}.currency`}
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
                                        {currencies.map((currency) => (
                                          <SelectItem key={currency.code} value={currency.code}>
                                            {currency.name} ({currency.code})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`forms.${index}.balance`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type='number'
                                      placeholder='0.0'
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      value={field.value || 0.0}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
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
    </ScrollArea>
  );
};
