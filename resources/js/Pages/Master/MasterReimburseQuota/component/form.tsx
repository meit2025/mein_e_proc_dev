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
import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';

import * as React from 'react';

import axiosInstance from '@/axiosInstance';

import { useAlert } from '@/contexts/AlertContext';
import { AxiosError } from 'axios';
import { FormType } from '@/lib/utils';
import { MultiSelect } from '@/components/commons/MultiSelect';
import { User } from '../models/models';

export interface props {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  id?: string;
  storeURL?: string;
  editURL?: string;
  updateURL?: string;
  listUser: User[];
}

export default function ReimburseQuotaForm({
  onSuccess,
  type = FormType.create,
  listUser,
  storeURL,
  editURL,
  updateURL
}: props) {

  const [users, setUsers] = React.useState<User>([]);
  const { dataDropdown: dataReimburseType, getDropdown: getReimburseType } = useDropdownOptions();
  const { dataDropdown: dataReimbursePeriod, getDropdown: getReimbursePeriod } = useDropdownOptions();
  
  const formSchema = z.object({
    period: z.number('Period must choose'),
    type: z.number('Type must choose'),
    users: z.array(z.number().optional()),
  });

  const defaultValues = {
    period: null,
    type: null,
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

  const handleSearchReimburseType = async (query: string) => {
    if (query.length > 0) {
      getReimburseType(query, {
        name: 'code',
        id: 'id',
        tabel: 'master_type_reimburses',
      });
    }
  };

  const handleSearchReimbursePeriod = async (query: string) => {
    if (query.length > 0) {
      getReimbursePeriod(query, {
        name: 'start',
        id: 'id',
        tabel: 'master_period_reimburses',
      });
    }
  };

  React.useEffect(() => {
    getReimburseType('', {
      name: 'code',
      id: 'id',
      tabel: 'master_type_reimburses',
    });
    
    getReimbursePeriod('', {
      name: 'start',
      id: 'id',
      tabel: 'master_period_reimburses',
    });

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
                <FormAutocomplete<any>
                  options={dataReimbursePeriod}
                  fieldName='period'
                  isRequired={true}
                  disabled={false}
                  placeholder={'Reimburse Period'}
                  onSearch={handleSearchReimbursePeriod}
                  classNames='mt-2 w-full'
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
                <FormAutocomplete<any>
                  options={dataReimburseType}
                  fieldName='type'
                  isRequired={true}
                  disabled={false}
                  placeholder={'Reimburse Type'}
                  onSearch={handleSearchReimburseType}
                  classNames='mt-2 w-full'
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
