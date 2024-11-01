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
import {
  CREATE_API_BUSINESS_TRIP_GRADE,
  GET_DETAIL_BUSINESS_TRIP_GRADE,
} from '@/endpoint/business-grade/api';
import { FormType } from '@/lib/utils';
import { MultiSelect } from '@/components/commons/MultiSelect';
import { UserModel } from '../../BusinessTrip/models/models';

export interface GradeInterface {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  id?: string;
  editURL?: string;
  detailUrl?: string;
  createUrl?: string;
  listUser: UserModel[];
}
export function GradeForm({
  onSuccess,
  type = FormType.create,
  id,
  editURL,
  detailUrl,
  createUrl,
  listUser,
}: GradeInterface) {
  const formSchema = z.object({
    grade: z.string().min(1, 'Grade is required'),
    users: z.array(z.number().optional()),

    // name: z.string().min(1, 'Name is required'),
  });
  const defaultValues = {
    grade: '',
    users: [],
  };

  async function getDetailData() {
    try {
      const response = await axiosInstance.get(detailUrl ?? '');

      const grade = response.data.data.grade;
      const users = response.data.data.users;
      form.reset({
        grade: grade.grade,
        users: users,
      });

      console.log(response);
    } catch (e) {
      const error = e as AxiosError;
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
        response = axiosInstance.put(editURL ?? '', values);
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

  React.useEffect(() => {
    if (type === FormType.detail || type === FormType.edit) {
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
                Grade <span className='text-red-500'>*</span>
              </td>
              <td>
                <FormField
                  control={form.control}
                  disabled={type == FormType.edit}
                  name='grade'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Insert grade'
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
              <td width={200}>
                Users <span className='text-red-500'>*</span>
              </td>
              <td>
                <MultiSelect
                  onSelect={(value) => {
                    form.setValue(
                      'users',
                      value.map((map) => map.id),
                    );
                  }}
                  value={form.getValues('users')}
                  id='id'
                  label='name'
                  options={listUser}
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
