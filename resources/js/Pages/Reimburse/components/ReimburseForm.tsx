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

interface Reimburse {
  id: string;
  rn: string;
  remark: string;
  type: string;
  currency: string;
  balance: number;
  receipt_date: Date;
  start_date: Date;
  end_date: Date;
  period: string;
}

interface User {
  id: string;
  nip: string;
  name: string;
}

interface Group {
  id: string;
  code: string;
  remark: string;
  users: User;
  reimburses: Reimburse[];
}

interface Props {
  reimbursement: Group | null;
  reimburses: Reimburse[];
  currencies: { id: string; code: string; name: string }[];
  types: { id: string; code: string; name: string }[];
  periods: { id: string; code: string; start: string; end: string }[];
  users: User[];
  csrf_token: string;
}

export const ReimburseForm: React.FC<Props> = ({
  reimbursement,
  reimburses,
  currencies,
  types,
  periods,
  users,
  csrf_token,
}) => {
  const [formCount, setFormCount] = useState<number>(1);
  const [formData, setFormData] = useState<Reimburse[]>(reimburses);

  const formSchema = z.object({
    remark_group: z.string().nonempty('Remark is required'),
    requester: z.string().nonempty('Requester is required'),
    forms: z.array(
      z.object({
        rn: z.string(),
        type: z.string().nonempty('Type is required'),
        period: z.string().nonempty('Period is required'),
        remark: z.string().nonempty('Remark is required'),
        balance: z.number().min(1, 'Balance must be at least 1'),
        receipt_date: z.date(),
        start_date: z.date(),
        end_date: z.date(),
        currency: z.string().nonempty('Currency is required'),
        attachment: z.array(z.instanceof(File)).optional(),
      }),
    ),
    formCount: z.string().nonempty('Currency is required'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formCount: '1',
      remark_group: '',
      requester: '',
      forms: Array.from({ length: 1 }).map(() => ({
        rn: '',
        type: '',
        remark: '',
        period: '',
        balance: 0,
        receipt_date: new Date(),
        start_date: new Date(),
        end_date: new Date(),
        currency: 'IDR',
        attachment: null,
      })),
    },
  });

  useEffect(() => {
    if (reimbursement) {
      form.setValue('remark_group', reimbursement.remark);
      form.setValue('requester', reimbursement.users.nip);
      form.setValue('formCount', reimbursement.reimburses.length.toString());
      form.setValue(
        'forms',
        reimbursement.reimburses.map((reimburse) => ({
          rn: reimburse.rn,
          type: reimburse.type,
          remark: reimburse.remark,
          balance: Number(reimburse.balance),
          currency: reimburse.currency,
          period: reimburse.period,
          receipt_date: new Date(reimburse.receipt_date),
          start_date: new Date(reimburse.start_date),
          end_date: new Date(reimburse.end_date),
          attachment: reimburse.attachment || null,
        })),
      );
    }
  }, [reimbursement]);

  const handleFormCountChange = (value: number) => {
    setFormCount(value);

    const currentForms = form.getValues('forms');
    const newForms = Array.from({ length: value }).map((_, index) => {
      return (
        currentForms[index] || {
          rn: '',
          type: '',
          remark: '',
          period: '',
          balance: 0,
          receipt_date: new Date(),
          start_date: new Date(),
          end_date: new Date(),
          currency: 'IDR',
        }
      );
    });
    form.setValue('forms', newForms);
    form.setValue('formCount', value.toString());
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    // Append group data
    formData.append('remark_group', values.remark_group);
    formData.append('requester', values.requester);

    // Append form details and attachments
    values.forms.forEach((form, index) => {
      formData.append(`forms[${index}][rn]`, form.rn);
      formData.append(`forms[${index}][type]`, form.type);
      formData.append(`forms[${index}][remark]`, form.remark);
      formData.append(`forms[${index}][balance]`, form.balance.toString());
      formData.append(`forms[${index}][period]`, form.period);
      formData.append(`forms[${index}][currency]`, form.currency);
      formData.append(`forms[${index}][receipt_date]`, form.receipt_date.toISOString());
      formData.append(`forms[${index}][start_date]`, form.start_date.toISOString());
      formData.append(`forms[${index}][end_date]`, form.end_date.toISOString());
      form.attachment.forEach((file) => {
        formData.append(`forms[${index}][attachments][]`, file);
      });
    });

    // Make the request
    if (reimbursement) {
      Inertia.put(`/reimburse/${reimbursement.id}`, values, {
        headers: {
          'X-CSRF-TOKEN': csrf_token,
        },
      });
    } else {
      await Inertia.post('/reimburse', formData, {
        headers: {
          'X-CSRF-TOKEN': csrf_token,
          'Content-Type': 'multipart/form-data',
        },
      });
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
                <td>-</td>
              </tr>
              <tr>
                <td width={200}>Request Status</td>
                <td>-</td>
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
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                          >
                            <SelectTrigger className='w-[200px]'>
                              <SelectValue placeholder='Requester' />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.nip}>
                                  {user.name} ({user.nip})
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

          {Array.from({ length: form.watch('formCount') || 1 }).map((_, index) => (
            <Tabs key={index} defaultValue={`form${index + 1}`} className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value={`form${index + 1}`}>Form {index + 1}</TabsTrigger>
              </TabsList>
              <TabsContent value={`form${index + 1}`}>
                <FormField
                  control={form.control}
                  name={`forms.${index}.rn`}
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
                        <td>
                          <FormField
                            control={form.control}
                            name={`forms.${index}.type`}
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
                                      {types.map((type) => (
                                        <SelectItem key={type.code} value={type.code}>
                                          {type.name} ({type.code})
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
                        <td width={200}>Balance</td>
                        <td>
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
                        <td width={200}>Start Date</td>
                        <td>
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
                        </td>
                      </tr>

                      <tr>
                        <td width={200}>End Date</td>
                        <td>
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
                        <td width={200}>Receipt Date</td>
                        <td>
                          <FormField
                            control={form.control}
                            name={`forms.${index}.receipt_date`}
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
                        <td width={200}>Currency</td>
                        <td>
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
                        </td>
                      </tr>

                      <tr>
                        <td width={200}>Remark</td>
                        <td>
                          <FormField
                            control={form.control}
                            name={`forms.${index}.remark`}
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
            </Tabs>
          ))}

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
