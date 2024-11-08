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

import { ScrollArea } from '@/components/shacdn/scroll-area';

import { Checkbox } from '@/components/shacdn/checkbox';

import '../css/index.scss';

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

import axiosInstance from '@/axiosInstance';

import { useAlert } from '@/contexts/AlertContext';
import { RadioGroup, RadioGroupItem } from '@/components/shacdn/radio-group';
import { AxiosError } from 'axios';
import { FormType } from '@/lib/utils';
import { Loading } from '@/components/commons/Loading';

export interface props {
  onSuccess?: (value: boolean) => void;
  storeUrl?: string;
  editURL?: string;
  updateURL?: string;
  type?: FormType;
}

export default function ReimbursePeriodForm({ onSuccess, type, storeURL, editURL, updateURL }: props) {
  const formSchema = z.object({
    code: z.string(),
    start: z.date(),
    end: z.date(),
  });

  const defaultValues = {
    code: '',
    start: new Date(),
    end: null,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function getDetailData() {
    try {
      const response = await axiosInstance.get(editURL);
      const data = response.data.data[0];
      
      form.reset({
        code: data.code,
        start: new Date(data.start),
        // start: data.start,
        end: new Date(data.end),
      });
    } catch (e) {
      const error = e as AxiosError;
    }
  }

  const { showToast } = useAlert();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axiosInstance.post(storeURL, values);
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
            <tr>
              <td width={200}>
                Code <span className='text-red-500'>*</span>
              </td>
              <td>
                <FormField
                  control={form.control}
                  disabled={type == FormType.edit}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Insert code'
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
              <td width={200}>Start Date</td>
              <td>
                <FormField
                  control={form.control}
                  name='start'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomDatePicker 
                          initialDate={field.value}
                          onDateChange={(date) => field.onChange(date)} />
                        {/* <Input
                          type='date'
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)} /> */}
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
                  name='end'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomDatePicker 
                          initialDate={field.value}
                          onDateChange={(date) => field.onChange(date)} />
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
