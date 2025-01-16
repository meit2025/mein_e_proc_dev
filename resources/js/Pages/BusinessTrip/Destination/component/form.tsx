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
// import { Separator } from '@/components/shacdn/separator';

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

import {
  CREATE_API_ALLOWANCE_CATEGORY,
  GET_DETAIL_ALLOWANCE_CATEGORY,
  GET_LIST_ALLOWANCE_CATEGORY,
} from '@/endpoint/allowance-category/api';
import { useAlert } from '@/contexts/AlertContext';
import { AllowanceCategoryModel } from '../../AllowanceCategory/model/AllowanceModel';
import { RadioGroup, RadioGroupItem } from '@/components/shacdn/radio-group';
import { CREATE_API_PURPOSE_TYPE } from '@/endpoint/purpose-type/api';
import { all, AxiosError } from 'axios';
import { AllowanceItemModel } from '../../AllowanceItem/models/models';
import { FormType } from '@/lib/utils';
import { MultiSelect } from '@/components/commons/MultiSelect';
import { DestinationModel } from '../models/models';
//

interface FormInterface {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  id?: string;
  detailUrl?: string;
  editUrl?: string;
  createUrl?: string;
}
export default function DestinationForm({
  onSuccess,
  type = FormType.create,
  editUrl,
  detailUrl,
  createUrl,
  id,
}: FormInterface) {
  const formSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    destination: z.string().min(1, 'Destination is required'),
    type: z.string().min(1, 'Type is required'),
  });

  const defaultValues = {
    code: '',
    destination: '',
    type: '',
  };

  //   console.log('currency_id', listCurrency);
  async function getDetailData() {
    try {
      const response = await axiosInstance.get(detailUrl ?? '');

      const data = response.data.data.destination as DestinationModel;

      form.reset({
        code: data.code,
        type: data.type,
        destination: data.destination,
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
      // const response = await axiosInstance.post(CREATE_API_PURPOSE_TYPE, values);
      let response = null;
      if (type === FormType.edit) {
        response = await axiosInstance.put(editUrl ?? '', values);
      } else {
        response = await axiosInstance.post(createUrl ?? '', values);
      }

      showToast('success', 'success');
      onSuccess?.(true);
    } catch (e) {
      showToast('Please Check the input', 'error');
    }
  };

  // console.log('list allowance',listAllowanceModel)

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
                          type='text'
                          readOnly={type === FormType.edit}
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
              <td width={200}>
                Type <span className='text-red-500'>*</span>
              </td>
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
                            <SelectValue placeholder='Select Attedance status' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key={'international'} value={'international'}>
                              INTERNATIONAL
                            </SelectItem>
                            <SelectItem key={'domestic'} value={'domestic'}>
                              DOMESTIC
                            </SelectItem>
                            <SelectItem key={'local'} value={'local'}>
                              LOCAL
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
              <td width={200}>Destination</td>
              <td>
                <FormField
                  control={form.control}
                  name='destination'
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
