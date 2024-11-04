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
import { Grade } from '../models/models';
import { CREATE_API_REIMBURSE_TYPE } from '@/endpoint/reimburseType/api';
import useDropdownOptions from '@/lib/getDropdown';
import { Loading } from '@/components/commons/Loading';

export interface props {
  onSuccess?: (value: boolean) => void;
  listGrades?: Grade[];
  editURL?: string,
  updateURL?: string,
  type?: FormType;
  id?: string;
}

export default function ReimburseTypeForm({
  onSuccess,
  listGrades,
  editURL,
  updateURL,
  type,
  id,
}: props) {
  const formSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    is_employee: z.boolean(),
    plafon: z.number().min(1, 'Plafon Number Must input >= 1'),
    limit: z.number().min(1, 'Limit Number Must input >= 1'),
    grade: z.string(),
    material_group: z.string().min(1, 'Material group required'),
    material_number: z.string().min(1, 'Material number required'),
  });

  const { dataDropdown: materialGroup, getDropdown: getMaterialGroup } = useDropdownOptions();
  const { dataDropdown: materialNumber, getDropdown: getMaterialNumber } = useDropdownOptions();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const defaultValues = {
    code: '',
    name: '',
    is_employee: true,
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
        name: data.name,
        limit: data.limit,
        plafon: data.plafon,
        is_employee: data.is_employee,
        grade: data.grade,
        material_group: data.material_group,
        material_number: data.material_number,
      });
    } catch (e) {
      const error = e as AxiosError;
    }
  }

  const { showToast } = useAlert();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(CREATE_API_REIMBURSE_TYPE, values);
      onSuccess && onSuccess(true);
      showToast(response?.data?.message, 'success');
    } catch (e) {
      onSuccess && onSuccess(false);
      showToast(e.message, 'error');
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    getMaterialGroup('', {
      name: 'material_group_desc',
      id: 'material_group',
      tabel: 'material_groups',
    });

    getMaterialNumber('', {
      name: 'material_number',
      id: 'material_number',
      tabel: 'master_materials',
    });
    
    if (type === FormType.edit) {
      getDetailData();
    }
  }, [id, type]);

  return (
    <ScrollArea className='h-[600px] w-full'>
      <Loading isLoading={isLoading} />
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
                  disabled={type === FormType.edit}
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

            <tr>
              <td width={200}>For</td>
              <td>
                <FormField
                  control={form.control}
                  name='is_employee'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value === 'true')}
                          value={field.value ? 'true' : 'false'}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key='is_employee' value='true'>
                              Employee
                            </SelectItem>
                            <SelectItem key='is_employee' value='false'>
                              Family
                            </SelectItem>
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
                Limit <span className='text-red-500'>*</span>
              </td>
              <td>
                <FormField
                  control={form.control}
                  disabled={type == FormType.edit}
                  name='limit'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value}
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
                Plafon <span className='text-red-500'>*</span>
              </td>
              <td>
                <FormField
                  control={form.control}
                  disabled={type == FormType.edit}
                  name='plafon'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
            </tr>

            <tr>
              <td width={200}>Grade</td>
              <td>
                <FormField
                  control={form.control}
                  name='grade'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-' />
                          </SelectTrigger>
                          <SelectContent>
                            {listGrades.map((listGrade) => (
                              <SelectItem key={listGrade.id.toString()} value={listGrade.id.toString()}>
                                {listGrade.grade.toString()}
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
              <td width={200}>Material Group</td>
              <td>
                <FormField
                  control={form.control}
                  name='material_group'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-' />
                          </SelectTrigger>
                          <SelectContent>
                            {materialGroup.map((material) => (
                              <SelectItem key={material.id} value={material.value}>
                                {material.label}
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
              <td width={200}>Material Number</td>
              <td>
                <FormField
                  control={form.control}
                  name='material_number'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-' />
                          </SelectTrigger>
                          <SelectContent>
                            {materialNumber.map((material) => (
                              <SelectItem key={material.value} value={material.value}>
                                {material.label}
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
