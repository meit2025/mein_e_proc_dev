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
import * as React from 'react';

import axiosInstance from '@/axiosInstance';

import { useAlert } from '@/contexts/AlertContext';
import { AxiosError } from 'axios';
import { FormType } from '@/lib/utils';
import { ListPeriodModel } from '../../MasterReimbursePeriod/models/models';
import {
  CREATE_API_REIMBURSE_QUOTA,
  GET_DETAIL_REIMBURSE_QUOTA,
} from '@/endpoint/reimburseQuota/api';
import { User } from '../models/models';

export interface props {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  id?: string;
  listPeriodReimburse: ListPeriodModel[];
  listUsers: User[];
}

export default function ReimburseQuotaForm({
  onSuccess,
  type = FormType.create,
  id,
  listPeriodReimburse,
  listUsers,
}: props) {

  const formSchema = z.object({
    period: z.string('Period must choose'),
    type: z.string('Type must choose'),
    user: z.string('User must choose')
  });

  const defaultValues = {
    period: '',
    type: '',
    user: ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const [listReimburseTypes, setListReimburseType] = React.useState([]);

  async function getDetailData() {
    const url = GET_DETAIL_REIMBURSE_QUOTA(id);

    try {
      const response = await axiosInstance.get(url);
      form.reset({
        id: response.data.data.id,
      });
    } catch (e) {
      const error = e as AxiosError;
    }
  }

  async function getSelectionType(user_id) {
    const url = `/api/master/reimburse-quota/selection_grade/${user_id}`;
    try {
      const response = await axiosInstance.get(url);
      const data = response.data.data;
      console.log(data);
      setListReimburseType(data);
    } catch (e) {
      const error = e as AxiosError;
    }
    form.setValue('user', user_id);
  }

  const { showToast } = useAlert();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axiosInstance.post(CREATE_API_REIMBURSE_QUOTA, values);
      onSuccess?.(true);
      showToast(response?.data?.message, 'success');
    } catch (e) {
      onSuccess?.(false);
      showToast(e.message, 'error');
    }
  };

  React.useEffect(() => {
    if (id && type == FormType.edit) {
      getDetailData();
    }
  }, [id, type]);

  return (
    <ScrollArea className='h-[600px] w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <table className='text-xs mt-4 table font-thin'>
            <tr>
              <td width={200}>Period</td>
              <td>
                <FormField
                  control={form.control}
                  name='period'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value?.toString()}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-' />
                          </SelectTrigger>
                          <SelectContent>
                            {listPeriodReimburse.map((period) => (
                              <SelectItem key={period.id} value={period.id.toString()}>
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
              <td width={200}>User</td>
              <td>
                <FormField
                  control={form.control}
                  name='user'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => getSelectionType(value)}
                          value={field.value?.toString()}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-' />
                          </SelectTrigger>
                          <SelectContent>
                            {listUsers.map((user) => (
                              <SelectItem key={user.id.toString()} value={user.id.toString()}>
                                ({user.nip}) {user.name}
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
              <td width={200}>Type</td>
              <td>
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value?.toString()}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-' />
                          </SelectTrigger>
                          <SelectContent>
                            {listReimburseTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.name}
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
          <div className='flex justify-end items-center'>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
