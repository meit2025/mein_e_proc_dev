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
import { MultiSelect } from '@/components/commons/MultiSelect';
import { ListPeriodModel } from '../../MasterReimbursePeriod/models/models';
import { ReimburseTypeModel } from '../../MasterReimburseType/models/models';
import { User } from '../models/models';

export interface props {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  id?: string;
  storeURL?: string;
  editURL?: string;
  updateURL?: string;
  listPeriodReimburse: ListPeriodModel[];
  listReimburseType: ReimburseTypeModel[];
  listUser: User[];
}

export default function ReimburseQuotaForm({
  onSuccess,
  type = FormType.create,
  listUser,
  storeURL,
  editURL,
  listPeriodReimburse,
  listReimburseType,
  updateURL
}: props) {

  const [users, setUsers] = React.useState<User>([]);
  
  const formSchema = z.object({
    period: z.string('Period must choose'),
    type: z.string('Type must choose'),
    users: z.array(z.number().optional()),
  });

  const defaultValues = {
    period: '',
    type: '',
    users: [],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function getDetailData() {
    try {
      const response = await axiosInstance.get(editURL);
      const data = response.data.data;
      // await getSelectionType(data.users);
      
      form.reset({
        period: data.period.toString(),
        type: data.type.toString(),
        users: data.users,
      });
    } catch (e) {
      const error = e as AxiosError;
    }
  }
  
  const { showToast } = useAlert();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      
      let response;
      if (type === FormType.edit) {
        response = await axiosInstance.put(updateURL ?? '', values);
      } else {
        response = await axiosInstance.post(storeURL ?? '', values);
      }
      
      onSuccess?.(true);
      showToast(response?.data?.data, 'success');
    } catch (e) {
      onSuccess?.(false);
      showToast(e.message, 'error');
    }
  };

  React.useEffect(() => {
    if (type === FormType.edit) {
      getDetailData()
    };
    setUsers(listUser);
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
                  options={users}
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
                            {listReimburseType.map((type) => (
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
