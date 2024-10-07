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

import axiosInstance from '@/axiosInstance';

import {
  CREATE_API_ALLOWANCE_CATEGORY,
  GET_DETAIL_ALLOWANCE_CATEGORY,
  GET_LIST_ALLOWANCE_CATEGORY,
} from '@/endpoint/allowance-category/api';
import { useAlert } from '@/contexts/AlertContext';
import { AllowanceCategoryModel } from '../../AllowanceCategory/model/AllowanceModel';
import { CurrencyModel } from '../models/models';
import { RadioGroup, RadioGroupItem } from '@/components/shacdn/radio-group';
import { CREATE_API_ALLOWANCE_ITEM } from '@/endpoint/allowance-item/api';
import { AxiosError } from 'axios';
// 

export enum AllowanceType {
  create,
  edit,
  update,
}

export interface AllowanceItemFormInterface {
  onSuccess?: (value: boolean) => void;
  type?: AllowanceType;
  id?: string;
  listCurrency: CurrencyModel[];
  listAllowanceCategory: AllowanceCategoryModel[];
}
export default function AllowanceItemForm({
  onSuccess,
  type = AllowanceType.create,
  id,
  listCurrency,
  listAllowanceCategory,
}: AllowanceItemFormInterface) {
  var formSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    currency_id: z.string().min(1, 'Currency is required'),
    formula: z.string().min(1, 'Formula is required'),
    allowance_category_id: z.string().min(1, 'Allowance Category is required'),
    request_value: z.string().min(1, 'Required'),
  });

  let defaultValues = {
    code: '',
    name: '',
    type: '',
    currency_id: '',
    fixed_value: '',
    max_value: '',
    request_value: 'unlimited',
    formula: '',
    allowance_category_id: '',
  };

//   console.log('currency_id', listCurrency);
  async function getDetailData() {
    let url = GET_DETAIL_ALLOWANCE_CATEGORY(id);

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

    console.log(values);
    try {
      const response =  await axiosInstance.post(CREATE_API_ALLOWANCE_ITEM, values);

      console.log('response' , response);
      showToast('success', 'success');
      onSuccess?.(true);
    } catch (e) {
  


      
     
      onSuccess?.(false);

      showToast('Please Check the input', 'error');
   
    }
  };

  React.useEffect(() => {
    if (id && type == AllowanceType.edit) {
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
                  disabled={type == AllowanceType.edit}
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
              <td width={200}>Type</td>
              <td>
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)} // Pass selected value to React Hook Form
                          value={field.value} // Set the current value from React Hook Form
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key='day' value='Day'>
                              Day
                            </SelectItem>
                            <SelectItem key='total' value='total'>
                              Total
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
              <td width={200}>Currency</td>
              <td>
                <FormField
                  control={form.control}
                  name='currency_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)} // Pass selected value to React Hook Form
                          value={field.value} // Set the current value from React Hook Form
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Select Currency' />
                          </SelectTrigger>
                          <SelectContent>
                            {listCurrency.map((item) => (
                              <SelectItem key={item.code} value={item.code}>
                                {item.name} {item.code}
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
              <td width={200}>Allowance Category</td>
              <td>
                <FormField
                  control={form.control}
                  name='allowance_category_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)} // Pass selected value to React Hook Form
                          value={field.value} // Set the current value from React Hook Form
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Select Allowance Category' />
                          </SelectTrigger>
                          <SelectContent>
                            {listAllowanceCategory.map((item) => (
                              <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name}
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
              <td width={200}>Purpose Type</td>
              <td>
                <ScrollArea className='h-[250px] border rounded-lg p-6 w-full'></ScrollArea>
              </td>
            </tr>
            <tr>
              <td width={200}>Formula</td>
              <td>
                <FormField
                  control={form.control}
                  name='formula'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder='Insert formula' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
            </tr>

            <tr>
              <td width={200}>Request Value</td>
              <td>
                <FormField
                  control={form.control}
                  name='request_value'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex space-x-1'
                        >
                          <FormItem className='flex text-xs items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='unlimited' />
                            </FormControl>
                            <FormLabel className='text-xs'>Unlimited</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='up to max value' />
                            </FormControl>
                            <FormLabel className='text-xs'>Up To Max Value</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='fixed value' />
                            </FormControl>
                            <FormLabel className='text-xs'>Fixed Value</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
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
