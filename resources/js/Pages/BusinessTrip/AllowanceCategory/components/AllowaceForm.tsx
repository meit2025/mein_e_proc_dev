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
import { Separator } from '@/components/shacdn/separator';

import '../css/index.scss';

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
import axios, { AxiosError } from 'axios';
import axiosInstance from '@/axiosInstance';
import {
  CREATE_API_ALLOWANCE_CATEGORY,
  GET_DETAIL_ALLOWANCE_CATEGORY,
  GET_LIST_ALLOWANCE_CATEGORY,
} from '@/endpoint/allowance-category/api';
import { useAlert } from '@/contexts/AlertContext';
import { FormType } from '@/lib/utils';

export interface AllowanceFormInterface {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  detailUrl?: string;
  updateUrl?: string;
  createUrl?: string;
  id?: string;
}
export function AllowanceForm({
  onSuccess,
  type = FormType.create,
  id,
  createUrl,
  updateUrl,
  detailUrl,
}: AllowanceFormInterface) {
  const formSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
  });

  const defaultValues = {
    code: '',
    name: '',
  };

  async function getDetailData() {
    try {
      const response = await axiosInstance.get(detailUrl ?? '');

      form.reset({
        code: response.data.data.code,
        name: response.data.data.name,
      });
    } catch (e) {
      let error = e as AxiosError;
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const { showToast } = useAlert();
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      let response;

      if (type === FormType.edit) {
        response = axiosInstance.put(updateUrl ?? '', values);
      } else {
        response = axiosInstance.post(createUrl ?? '', values);
      }

      console.log(response);
      showToast('succesfully created data', 'success');
      onSuccess?.(true);
    } catch (e) {
      const error = e as AxiosError;

      onSuccess?.(false);
      console.log(error);
    }
  };

  console.log(type);

  React.useEffect(() => {
    if (type === FormType.edit || type === FormType.detail) {
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
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          readOnly={type === FormType.edit}
                          type='text'
                          placeholder='0.0'
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
              <td width={200}>Name</td>
              <td>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
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
          </table>
          <div className='flex justify-end items-center'>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
