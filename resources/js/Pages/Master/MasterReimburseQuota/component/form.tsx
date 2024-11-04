import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/shacdn/form';
import { z } from 'zod';
import { Button } from '@/components/shacdn/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ScrollArea } from '@/components/shacdn/scroll-area';
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
import { User } from '../models/models';

export interface props {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  id?: string;
  storeURL?: string;
  editURL?: string;
  updateURL?: string;
  listPeriodReimburse: ListPeriodModel[];
  listUsers: User[];
}

export default function ReimburseQuotaForm({
  onSuccess,
  type,
  listPeriodReimburse,
  listUsers,
  storeURL,
  editURL,
  updateURL
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

  async function getSelectionType(user_id) {
    const url = `/api/master/reimburse-quota/selection_grade/${user_id}`;
    try {
      const response = await axiosInstance.get(url);
      const data = response.data.data;
      setListReimburseType(data);
    } catch (e) {
      const error = e as AxiosError;
    }
    form.setValue('user', user_id);
  }

  async function getDetailData() {
    try {
      const response = await axiosInstance.get(editURL);
      const data = response.data.data[0];
      await getSelectionType(data.user);
      form.reset({
        period: data.period,
        user: data.user,
        type: data.type,
      });
    } catch (e) {
      const error = e as AxiosError;
    }
  }

  const { showToast } = useAlert();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axiosInstance.post(storeURL, values);
      onSuccess?.(true);
      showToast(response?.data?.message, 'success');
    } catch (e) {
      onSuccess?.(false);
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
