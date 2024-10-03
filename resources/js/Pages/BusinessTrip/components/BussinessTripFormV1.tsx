import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/shacdn/form';

import { z } from 'zod';

import { Button } from '@/components/shacdn/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/shacdn/textarea';

import '../css/business_trip.scss';
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
import * as React from 'react';

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

interface Props {
  users: User[];
  types: Type[];
  currencies: Currency[];
  csrf_token: string;
}

const formSchema = z.object({
  remark: z.string().min(1).max(50),
  reimburse_cost: z.number(),
});
export const BussinessTripFormV1 = ({
  users,
  types,
  currencies,
  csrf_token,
}: {
  users: User;
  types: Type;
  currencies: CurrencyModel;
  csrf_token: string;
}) => {
  // defining form for reimburese form
  const formSchema = z.object({
    type: z.string().nonempty('Type is required'),
    requester: z.string().nonempty('Requester is required'),
    remark: z.string().nonempty('Remark is required'),
    balance: z.number().min(1, 'Balance must be at least 1'),
    receipt_date: z.date(),
    start_date: z.date(),
    end_date: z.date(),
    start_balance_date: z.date(),
    end_balance_date: z.date(),
    currency: z.string().nonempty('Currency is required'),
  });
  const [totalDestination, setTotalDestination] = React.useState<string>('1');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      requester: '',
      remark: '',
      balance: 0,
      receipt_date: new Date(),
      start_date: new Date(),
      end_date: new Date(),
      start_balance_date: new Date(),
      end_balance_date: new Date(),
      currency: 'IDR',
    },
  });
  return (
    <ScrollArea className='h-[600px] w-full '>
      <Form {...form}>
        <table className='text-xs mt-4 reimburse-form-table font-thin'>
          <tr>
            <td width={200}>Request No.</td>
            <td>Test-12321</td>
          </tr>
          <tr>
            <td width={200}>Bussiness Trip Purpose Type</td>
            <td>
              {' '}
              <FormField
                control={form.control}
                name='remark'
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Select>
                        <SelectTrigger className='w-[200px]'>
                          <SelectValue placeholder='-- Select Bussiness Trip --' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='select'>-- Select One --</SelectItem>
                          <SelectItem value='test'>Test Bussines Trip</SelectItem>
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
            <td width={200}>Request For </td>
            <td>
              {' '}
              <FormField
                control={form.control}
                name='remark'
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Select>
                        <SelectTrigger className='w-[200px] py-2'>
                          <SelectValue placeholder='-- Select Bussiness Trip --' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='samsudin'> Samsudin </SelectItem>
                          <SelectItem value='verrandy'>Verrandy</SelectItem>
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
            <td width={200}>Remark</td>
            <td>
              <FormField
                control={form.control}
                name='remark'
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Textarea
                        placeholder='Insert remark'
                        {...field}
                        rows={4}
                        className='w-[300px]'
                      />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
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
                name='remark'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs text-gray-500 font-extralight mb-1'>
                      Max File: 1000KB
                    </FormLabel>
                    <FormControl>
                      <Input type='file' {...field} />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </td>
          </tr>

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
                name='remark'
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>{totalDestination}</FormLabel> */}
                    <FormControl>
                      <Select value={totalDestination} onValueChange={setTotalDestination}>
                        <SelectTrigger className='w-[200px] py-2'>
                          <SelectValue placeholder='-- Select Bussiness Trip --' />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, index) => (
                            <SelectItem value={(index + 1).toString()}> {index + 1} </SelectItem>
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
        </table>

        <Separator className='my-4' />

        <Tabs defaultValue='destination1' className='w-full'>
          <TabsList className={`flex items-center justify-start space-x-4`}>
            {Array.from({ length: parseInt(totalDestination) }, (_, index) => (
              <TabsTrigger value={`destination${index + 1}`}>Destination {index + 1}</TabsTrigger>
            ))}
          </TabsList>

          {Array.from({ length: parseInt(totalDestination) }, (_, index) => (
            <TabsContent value={`destination${index + 1}`}>
              <div>
                <table className='text-xs mt-4 reimburse-form-detail font-thin'>
                  <tr>
                    <td width={200}>Destination</td>
                    <td>
                      <FormField
                        control={form.control}
                        name='remark'
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Username</FormLabel> */}
                            <FormControl>
                              <Select>
                                <SelectTrigger className='w-[200px]'>
                                  <SelectValue placeholder='Destination' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='jakarta'>Jakarta</SelectItem>
                                  <SelectItem value='banyuwangi'>Banyuwangi</SelectItem>
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
                    <td width={200}>Bussines Trip Date</td>
                    <td className='flex space-x-2 items-center'>
                      <FormField
                        control={form.control}
                        name='remark'
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

                      <span>To</span>
                      <FormField
                        control={form.control}
                        name='remark'
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

                      <Button>Get Detail</Button>
                    </td>
                  </tr>
                </table>
                <table className='text-xs mt-4 reimburse-form-detail font-thin'>
                  <tr>
                    <td colSpan={2}>
                      <div className='mb-4 text-sm'>Detail Attedance:</div>
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
                          <tr>
                            <td>11/10/2024</td>

                            <td>SHEREGULAR</td>
                            <td>08:00</td>
                            <td>19:00</td>
                            <td>
                              <FormField
                                control={form.control}
                                name='remark'
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
                            <td>
                              <FormField
                                control={form.control}
                                name='remark'
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
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </table>

                <table className='text-xs mt-4 reimburse-form-detail font-thin'>
                  <tr>
                    <td className='text-sm'>Detail Bussines Trip Allowance:</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td width={300}>Breakfast Sector A Domestic</td>
                    <td>3 Day(s)* 25000 * 100 = IDR 750000</td>
                  </tr>
                  <tr>
                    <td width={300}>Dinner Sector A Domestic</td>
                    <td>3 Day(s)* 25000 * 100 = IDR 750000</td>
                  </tr>
                  <tr>
                    <td width={300}>Lunch Sector A Domestic</td>
                    <td>3 Day(s)* 25000 * 100 = IDR 750000</td>
                  </tr>
                  <tr>
                    <td width={300}>Pocket Money Allowance Sector A Domestic</td>
                    <td>3 Day(s)* 25000 * 100 = IDR 750000</td>
                  </tr>
                  <tr>
                    <td width={200}>Toll Total</td>
                    <td>
                      <td className='flex items-center space-x-2'>
                        <span>IDR</span>
                        <FormField
                          control={form.control}
                          name='remark'
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Username</FormLabel> */}
                              <FormControl>
                                <Input type='text' {...field} />
                              </FormControl>
                              {/* <FormDescription>This is your public display name.</FormDescription> */}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span>*100% = IDR 100000</span>
                      </td>
                    </td>
                  </tr>
                  <tr>
                    <td width={200}>Gasoline Total</td>
                    <td>
                      <td className='flex items-center space-x-2'>
                        <span>IDR</span>
                        <FormField
                          control={form.control}
                          name='remark'
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Username</FormLabel> */}
                              <FormControl>
                                <Input type='text' {...field} />
                              </FormControl>
                              {/* <FormDescription>This is your public display name.</FormDescription> */}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span>*100% = IDR 100000</span>
                      </td>
                    </td>
                  </tr>

                  <tr>
                    <td width={200}>Other Allowance</td>
                    <td>
                      <td className='flex items-center space-x-2'>
                        <span>IDR</span>
                        <FormField
                          control={form.control}
                          name='remark'
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Username</FormLabel> */}
                              <FormControl>
                                <Input type='text' {...field} />
                              </FormControl>
                              {/* <FormDescription>This is your public display name.</FormDescription> */}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span>*100% = IDR 100000</span>
                      </td>
                    </td>
                  </tr>

                  <tr>
                    <td width={200}>Parking Total</td>
                    <td>
                      <td className='flex items-center space-x-2'>
                        <span>IDR</span>
                        <FormField
                          control={form.control}
                          name='remark'
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Username</FormLabel> */}
                              <FormControl>
                                <Input type='text' {...field} />
                              </FormControl>
                              {/* <FormDescription>This is your public display name.</FormDescription> */}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span>*100% = IDR 100000</span>
                      </td>
                    </td>
                  </tr>
                </table>

                <table className='w-3/4 detail-bussiness text-xs text-gray-600 font-light'>
                  <thead>
                    <th>Item</th>
                    <th className='text-right'>SubTotal</th>
                  </thead>

                  <tbody>
                    <tr>
                      <td width={'50%'} className='flex justify-between items-center'>
                        <span>Breakfast Sector A Domestic</span>
                        <span>IDR</span>
                      </td>
                      <td className='text-right'>
                        <span>70.000</span>
                      </td>
                    </tr>
                    <tr>
                      <td width={'50%'} className='flex justify-between items-center'>
                        <span>Dinner Sector A Domestic</span>
                        <span>IDR</span>
                      </td>
                      <td className='text-right'>
                        <span>70.000</span>
                      </td>
                    </tr>
                    <tr>
                      <td width={'50%'} className='flex justify-between items-center'>
                        <span>Lunch Sector A Domestic</span>
                        <span>IDR</span>
                      </td>
                      <td className='text-right'>
                        <span>70.000</span>
                      </td>
                    </tr>
                    <tr>
                      <td width={'50%'} className='flex justify-between items-center'>
                        <span>Pocket Money Allowance Sector A Domestic</span>
                        <span>IDR</span>
                      </td>
                      <td className='text-right'>
                        <span>70.000</span>
                      </td>
                    </tr>
                    <tr>
                      <td width={'50%'} className='flex justify-between items-center'>
                        <span>Toll Total</span>
                        <span>IDR</span>
                      </td>
                      <td className='text-right'>
                        <span>70.000</span>
                      </td>
                    </tr>
                    <tr>
                      <td width={'50%'} className='flex justify-between items-center'>
                        <span>Gasoline Total</span>
                        <span>IDR</span>
                      </td>
                      <td className='text-right'>
                        <span>70.000</span>
                      </td>
                    </tr>
                    <tr>
                      <td width={'50%'} className='flex justify-between items-center'>
                        <span>Other Allowance</span>
                        <span>IDR</span>
                      </td>
                      <td className='text-right'>
                        <span>70.000</span>
                      </td>
                    </tr>
                    <tr>
                      <td width={'50%'} className='flex justify-between items-center'>
                        <span>Parking Total</span>
                        <span>IDR</span>
                      </td>
                      <td className='text-right'>
                        <span>70.000</span>
                      </td>
                    </tr>
                    <tr>
                      <td width={'50%'} className='flex justify-between pt-8 items-center'>
                        <span className='italic text-sm'>Total Allowance</span>
                        <span>IDR</span>
                      </td>
                      <td className='text-right pt-8'>
                        <span>70.000</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Form>
    </ScrollArea>
  );
};
