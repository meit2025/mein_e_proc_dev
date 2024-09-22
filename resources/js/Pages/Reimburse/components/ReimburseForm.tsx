import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/shacdn/form';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
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

const formSchema = z.object({
  remark: z.string().min(1).max(50),
  reimburse_cost: z.number(),
});
export const ReimburseForm = () => {
  // defining form for reimburese form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remark: '',
      reimburse_cost: 0,
    },
  });

  return (
    <ScrollArea className='h-[600px] w-full '>
      <Form {...form}>
        <table className='text-xs mt-4 reimburse-form-table font-thin'>
          <tr>
            <td width={200}>Reimburse Request No.</td>
            <td>Test-12321</td>
          </tr>
          <tr>
            <td width={200}>Request Status</td>
            <td>Fully Approved</td>
          </tr>

          <tr>
            <td width={200}>Request For</td>
            <td>Samsudin</td>
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
                      <Textarea placeholder='Insert remark' {...field} />
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

        <Tabs defaultValue='form1' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='form1'>Form1</TabsTrigger>
            {/* <TabsTrigger value='form2'>Form2</TabsTrigger> */}
          </TabsList>
          <TabsContent value='form1'>
            <div>
              <table className='text-xs mt-4 reimburse-form-detail font-thin'>
                <tr>
                  <td width={200}>Type of Reimbursment</td>
                  <td>Glasses</td>
                </tr>
                <tr>
                  <td width={200}>Reimbursment Balance Date</td>
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
                                <SelectValue placeholder='Reimburse date' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='light'>22 Nov 23 - 26 Nov 24</SelectItem>
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
                  <td width={200}>Employee</td>
                  <td>
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
                                  <SelectValue placeholder='' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='employee'>Employee</SelectItem>
                                  <SelectItem value='children'>Children</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            {/* <FormDescription>This is your public display name.</FormDescription> */}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                  </td>
                </tr>
                <tr>
                  <td width={200}>Balance</td>
                  <td>IDR 512.000</td>
                </tr>

                <tr>
                  <td width={200}>Limit per claim</td>
                  <td>Unlimited</td>
                </tr>

                <tr>
                  <td width={200}>Receipt Date</td>
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

                <tr>
                  <td width={200}>Start date</td>
                  <td className='flex items-center'>
                    {/* <CustomDatePicker /> */}
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
                    <span className='mx-2'>End Date</span>
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

                <tr>
                  <td width={200}>Reimburse Cost</td>
                  <td className='flex items-center space-x-3'>
                    <FormField
                      control={form.control}
                      name='remark'
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Username</FormLabel> */}
                          <FormControl>
                            <Select>
                              <SelectTrigger className='w-[100px]'>
                                <SelectValue placeholder='' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='employee'>IDR</SelectItem>
                                <SelectItem value='children'>USD</SelectItem>
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
                      name='reimburse_cost'
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Username</FormLabel> */}
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          {/* <FormDescription>This is your public display name.</FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <span>Valid Cost:</span>

                    <FormField
                      control={form.control}
                      name='reimburse_cost'
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Username</FormLabel> */}
                          <FormControl>
                            <Input {...field} disabled className='bg-gray-200' />
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
                  <td>file.tsx</td>
                </tr>
                <tr>
                  <td width={200}>Replace File Attachment</td>
                  <td>
                    <FormField
                      control={form.control}
                      name='remark'
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Username</FormLabel> */}
                          <FormControl>
                            <Input id='picture' type='file' className='w-[200px]' />
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
                  <td>tsx,jpg</td>
                </tr>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </Form>
    </ScrollArea>
  );
};
