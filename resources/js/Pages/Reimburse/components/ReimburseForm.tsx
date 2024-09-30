import { useState } from 'react';
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

interface User {
  id: string;
  nip: string;
  name: string;
}

interface Type {
  id: string;
  code: string;
  name: string;
  claim_limit: number;
  plafon: number;
}

interface Currency {
  id: string;
  code: string;
}

interface Period {
  id: string;
  code: string;
  start: string;
  end: string;
}

interface Props {
  users: User[];
  types: Type[];
  periods: Period[];
  currencies: Currency[];
  csrf_token: string;
}

export const ReimburseForm: React.FC<Props> = ({
  users,
  types,
  currencies,
  periods,
  csrf_token,
}) => {
  const [formCount, setFormCount] = useState<number>(1); // Manage formCount state

  const formSchema = z.object({
    remark_group: z.string().nonempty('Remark is required'),
    requester: z.string().nonempty('Requester is required'),
    forms: z.array(
      z.object({
        type: z.string().nonempty('Type is required'),
        period: z.string().nonempty('Period is required'),
        remark: z.string().nonempty('Remark is required'),
        balance: z.number().min(1, 'Balance must be at least 1'),
        receipt_date: z.date(),
        start_date: z.date(),
        end_date: z.date(),
        currency: z.string().nonempty('Currency is required'),
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
        type: '',
        remark: '',
        period: '',
        balance: 0,
        receipt_date: new Date(),
        start_date: new Date(),
        end_date: new Date(),
        currency: 'IDR',
      })),
    },
  });

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    Inertia.post('/reimburse', values, {
      headers: {
        'X-CSRF-TOKEN': csrf_token,
      },
    });
  };

  const handleFormCountChange = (value: number) => {
    setFormCount(value);

    // Update form values based on the new formCount
    const currentForms = form.getValues('forms');
    const newForms = Array.from({ length: value }).map((_, index) => {
      return (
        currentForms[index] || {
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
    form.setValue('formCount', value); // Set form count in form state
  };

  return (
    <ScrollArea className='h-[600px] w-full '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <table className='text-xs mt-4 reimburse-form-table font-thin'>
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
                      {/* <FormLabel>Username</FormLabel> */}
                      <FormControl>
                        <Textarea placeholder='Insert remark' {...field} />
                      </FormControl>
                      {/* <FormDescription>This is your public display name.</FormDescription> */}
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
                          onValueChange={(value) => field.onChange(value)} // Pass selected value to React Hook Form
                          value={field.value} // Set the current value from React Hook Form
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
                          onValueChange={(value) => handleFormCountChange(value)}
                          value={formCount}
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
          </table>

          <Separator className='my-4' />

          {Array.from({ length: form.watch('formCount') || 1 }).map((_, index) => (
            <Tabs key={index} defaultValue={`form${index + 1}`} className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value={`form${index + 1}`}>Form {index + 1}</TabsTrigger>
              </TabsList>
              <TabsContent value={`form${index + 1}`}>
                <div>
                  <table className='text-xs mt-4 reimburse-form-detail font-thin'>
                    <tr>
                      <td width={200}>Type of Reimbursment</td>
                      <td>
                        <FormField
                          control={form.control}
                          name={`forms.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => field.onChange(value)} // Pass selected value to React Hook Form
                                  value={field.value} // Set the current value from React Hook Form
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
                                  onValueChange={(value) => field.onChange(value)} // Pass selected value to React Hook Form
                                  value={field.value} // Set the current value from React Hook Form
                                >
                                  <SelectTrigger className='w-[200px]'>
                                    <SelectValue placeholder='-' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {periods.map((period) => (
                                      <SelectItem key={period.id} value={period.code}>
                                        {period.start} - {period.end}
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
                              {/* <FormLabel>Username</FormLabel> */}
                              <FormControl>
                                <Textarea placeholder='Insert remark' {...field} />
                              </FormControl>
                              {/* <FormDescription>This is your public display name.</FormDescription> */}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td width={200}>Balance</td>
                      <td>-</td>
                    </tr>

                    <tr>
                      <td width={200}>Limit per claim</td>
                      <td>-</td>
                    </tr>

                    <tr>
                      <td width={200}>Receipt Date</td>
                      <td>
                        <FormField
                          control={form.control}
                          name={`forms.${index}.receipt_date`}
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Username</FormLabel> */}
                              <FormControl>
                                <CustomDatePicker />
                              </FormControl>
                              {/* <FormDescription>This is your public display name.</FormDescription> */}
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
                              {/* <FormLabel>Username</FormLabel> */}
                              <FormControl>
                                <CustomDatePicker />
                              </FormControl>
                              {/* <FormDescription>This is your public display name.</FormDescription> */}
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
                              {/* <FormLabel>Username</FormLabel> */}
                              <FormControl>
                                <CustomDatePicker />
                              </FormControl>
                              {/* <FormDescription>This is your public display name.</FormDescription> */}
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
                              {/* <FormLabel>Username</FormLabel> */}
                              <FormControl>
                                <Select>
                                  <SelectTrigger className='w-[100px]'>
                                    <SelectValue placeholder='-' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {currencies.map((currency) => (
                                      <SelectItem key={currency.code} value={currency.code}>
                                        {currency.code}
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
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          ))}

          <Button type='submit'>Save</Button>
        </form>
      </Form>
    </ScrollArea>
  );
};