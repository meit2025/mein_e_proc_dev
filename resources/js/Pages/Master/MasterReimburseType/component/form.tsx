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
import { MultiSelect } from '@/components/commons/MultiSelect';
import { MaterialModel } from '@/Pages/Master/MasterMaterial/model/listModel';
import { CREATE_API_REIMBURSE_TYPE, GET_DETAIL_REIMBURSE_TYPE } from '@/endpoint/reimburseType/api';

export interface props {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  id?: string;
  listMaterial: MaterialModel[];
}

export default function ReimburseTypeForm({
  onSuccess,
  type = FormType.create,
  id,
  listMaterial,
}: props) {
  var formSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    is_employee: z.boolean('Type of it is required'),
    material_group: z.string().min(1, 'Material group required'),
    material_number: z.string().min(1, 'Material number required'),
  });

  let defaultValues = {
    code: '',
    name: '',
    is_employee: true,
  };

  async function getDetailData() {
    let url = GET_DETAIL_REIMBURSE_TYPE(id);

    try {
      let response = await axiosInstance.get(url);

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
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axiosInstance.post(CREATE_API_REIMBURSE_TYPE, values);
      onSuccess?.(true);
      showToast(response.message, 'success');
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
                            {listMaterial.map((material) => (
                              <SelectItem
                                key={material.id}
                                value={material.material_group}
                              >
                                {material.material_group}
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
                            {listMaterial.map((material) => (
                              <SelectItem
                                key={material.id}
                                value={material.material_number}
                              >
                                {material.material_number}
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
