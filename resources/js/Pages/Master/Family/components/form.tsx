import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/shacdn/form';

import { z } from 'zod';
import moment from 'moment';
import { Button } from '@/components/shacdn/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ScrollArea } from '@/components/shacdn/scroll-area';

import '../css/index.scss';
import { CustomDatePicker } from '@/components/commons/CustomDatePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shacdn/select';
import { Input } from '@/components/shacdn/input';
import * as React from 'react';

import axiosInstance from '@/axiosInstance';

import { useAlert } from '@/contexts/AlertContext';
import { AxiosError } from 'axios';
import { FormType } from '@/lib/utils';

export interface props {
  onSuccess?: (value: boolean) => void;
  storeURL?: string;
  editURL?: string;
  updateURL?: string;
  userId?: number;
  type?: FormType;
}

export default function FamilyHeaderForm({
  onSuccess,
  type = FormType.create,
  storeURL,
  editURL,
  updateURL,
  userId,
}: props) {
  const formSchema = z.object({
    userId: z.string(),
    name: z.string().min(1, 'field name is required'),
    status: z.string(),
    bod: z.date(),
  });

  const defaultValues = {
    userId: userId,
    name: '',
    status: '',
    bod: null,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function getDetailData() {
    try {
      const response = await axiosInstance.get(editURL);
      const data = response.data.data;

      form.reset({
        userId: userId,
        name: data.name,
        status: data.status,
        bod: new Date(data.bod),
      });
    } catch (e) {
      const error = e as AxiosError;
    }
  }

  const { showToast } = useAlert();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let response;
      const valueData = {
        ...values,
        bod: moment(values.bod).format('YYYY-MM-DD'),
      }
      if (type === FormType.edit) {
        response = await axiosInstance.put(updateURL ?? '', valueData);
      } else {
        response = await axiosInstance.post(storeURL ?? '', valueData);
      }
      onSuccess && onSuccess(true);
      showToast(response?.data?.message, 'success');
    } catch (e) {
      onSuccess && onSuccess(false);
      showToast(e.message, 'error');
    }
  };

  React.useEffect(() => {
    if (type === FormType.edit) {
      getDetailData();
    }
  }, [type]);

  return (
    <ScrollArea className='h-[600px] w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <table className='text-xs mt-4 table font-thin'>
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='hidden'
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <tr>
              <td width={200}>
                Name <span className='text-red-500'>*</span>
              </td>
              <td>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Insert name'
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
            </tr>

            <tr>
              <td width={200}>Status</td>
              <td>
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Select Family Status' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='husband'>Husband</SelectItem>
                            <SelectItem value='wife'>Wife</SelectItem>
                            <SelectItem value='child'>Child</SelectItem>
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
              <td width={200}>Birth Of Data</td>
              <td>
                <FormField
                  control={form.control}
                  name='bod'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomDatePicker
                          initialDate={field.value}
                          onDateChange={(date) => field.onChange(date)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
            </tr>
          </table>
          <div className='flex justify-end items-center'>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}