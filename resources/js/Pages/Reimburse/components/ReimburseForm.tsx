import { useState, useEffect } from 'react';
import { Button } from '@/components/shacdn/button';
import { Inertia } from '@inertiajs/inertia';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/shacdn/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/shacdn/textarea';
import '../css/reimburse.scss';
import { ScrollArea } from '@/components/shacdn/scroll-area';
import axiosInstance from '@/axiosInstance';
import { Separator } from '@/components/shacdn/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shacdn/select';
import axios, { AxiosError } from 'axios';
import { CustomDatePicker } from '@/components/commons/CustomDatePicker';
import { Input } from '@/components/shacdn/input';
import { useAlert } from '../../../contexts/AlertContext.jsx';
import { usePage } from '@inertiajs/react';
import { User, Reimburse, Group, PurchasingGroup, Tax, CostCenter } from '../model/listModel';

interface Props {
  purchasing_groups: PurchasingGroup[];
  reimbursement: Group | null;
  reimburses: Reimburse[];
  currencies: { id: string; code: string; name: string }[];
  categories: string;
  periods: { id: string; code: string; start: string; end: string }[];
  users: User[];
  taxes: Tax[];
  cost_center: CostCenter[];
}

export const ReimburseForm: React.FC<Props> = ({
  purchasing_groups,
  reimbursement,
  reimburses,
  currencies,
  categories,
  periods,
  users,
  taxes,
  cost_center,
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

  const form = useForm({
    defaultValues: {
      formCount: '1',
      remark_group: '',
      cost_center: '',
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
        purchasing_group: '',
        period: '',
        type: '',
        item_delivery_data: new Date(),
        start_date: new Date(),
        end_date: new Date(),
      })),
    },
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

  useEffect(() => {
    if (reimbursement) {
      form.setValue('remark_group', reimbursement.remark);
      form.setValue('cost_center', reimbursement.cost_center);
      form.setValue('requester', reimbursement.users.nip);
      form.setValue('formCount', reimbursement.reimburses.length.toString());
      form.setValue('forms', reimbursement.reimburses.map((reimburse) => ({
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
      reimbursement.reimburses.forEach((reimburse, index) => {
        selectedTypeCode(index, reimburse.reimburse_type);
      });
    }
  }, [reimbursement]);

  const selectedEmployee = async (value: any) => {
    try {
      const response = await axios.get(`/family/show/${value}`);
      const typeData = response.data;
      setFamilies(typeData);
      setRequester(value);
      form.setValue('requester', value);
    } catch (error) {
      const resultError = error as AxiosError;
      const err = resultError.response.data;
      showToast(err.message, err.status);
    }
  }

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const selectedTypeCode = async (index, value) => {
    try {
      const response = await axios.get(`/reimburse/type/${value}`);
      const typeData = response.data;
      setReimburseTypes((prevTypes) => {
        const updatedTypes = [...prevTypes];
        updatedTypes[index] = typeData.data;
        return updatedTypes;
      });
      setIsFamily((prevIsFamily) => {
        const updatedIsFamily = [...prevIsFamily];
        updatedIsFamily[index] = value === 'Family';
        return updatedIsFamily;
      });
      form.setValue(`forms.${index}.type`, value);
    } catch (error) {
      const resultError = error as AxiosError;
      const err = resultError.response.data;
      showToast(err.message, err.status);
    }
  }

  const checkBalance = async (index, user, is_employee, type, period) => {
    const response = await axios.post('/reimburse/is_required', {
      user,
      is_employee,
      type,
      period,
    });
    const selectedType = response.data.data;
    console.log(selectedType);
    setLimits((prevLimits) => {
      const updatedLimits = [...prevLimits];
      updatedLimits[index] = {
        plafon: selectedType?.plafon,
        limit: selectedType?.limit,
      };
      return updatedLimits;
    });
    form.setValue(`forms.${index}.for`, user);
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axiosInstance.post('/reimburse', values);
      showToast(response.message, 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  return (
    <ScrollArea className='h-[600px] w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <table className='text-xs mt-4 reimburse-form-table font-thin'>
            <tbody>
              <tr>
                <td width={200}>Reimburse Request No.</td>
                <td>{reimbursement?.request_number ?? '-'}</td>
              </tr>
              <tr>
                <td width={200}>Request Status</td>
                <td>{reimbursement?.status ?? '-'}</td>
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
                          <Textarea
                            disabled={reimbursement !== null}
                            placeholder='Insert remark'
                            {...field}
                          />
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
                            disabled={reimbursement !== null}
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
                            disabled={reimbursement !== null}
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
                            disabled={reimbursement !== null}
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

            {Array.from({ length: form.watch('formCount') || 1 }).map((_, index) => (
              <TabsContent key={index} value={`form${index + 1}`}>
                <FormField
                  control={form.control}
                  name={`forms.${index}.id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className='sr-only' value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                                disabled={reimbursement !== null}
                                onValueChange={(value) => selectedTypeCode(index, value)}
                                value={field.value}
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
                                  form.setValue(`forms.${index}.reimburse_type`, value)
                                }
                                value={field.value}
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
                                    disabled={reimbursement !== null}
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
                                    disabled={reimbursement !== null}
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

                      <tr>
                        <td width={200}>Family</td>
                        <td>
                          <FormField
                            control={form.control}
                            name={`forms.${index}.for`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    disabled={!isFamily[index] || isFamily[index].length === 0}
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
                                        <SelectItem key={family.id} value={family.id.toString()}>
                                          {family.name}
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
                        <td width={200}>Tax</td>
                        <td>
                          <FormField
                            control={form.control}
                            name={`forms.${index}.tax_on_sales`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    disabled={reimbursement !== null}
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
                                    disabled={reimbursement !== null}
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
                                    disabled={reimbursement !== null}
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
                                    disabled={reimbursement !== null}
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
                                    disabled={reimbursement !== null}
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
                                    disabled={reimbursement !== null}
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
            ))}
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
