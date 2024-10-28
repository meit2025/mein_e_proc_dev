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
import { ListTypeModel } from '../../MasterReimburseType/models/models';
import { ListPeriodModel } from '../../MasterReimbursePeriod/models/models';
import { BusinessTripGrade } from '@/Pages/BusinessTrip/BusinessGrade/model/model';
import {
  CREATE_API_REIMBURSE_QUOTA,
  GET_DETAIL_REIMBURSE_QUOTA,
} from '@/endpoint/reimburseQuota/api';

export interface props {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  id?: string;
  listTypeReimburse: ListTypeModel[];
  listPeriodReimburse: ListPeriodModel[];
  listGrade: BusinessTripGrade[];
}

export default function ReimburseQuotaForm({
  onSuccess,
  type = FormType.create,
  id,
  listTypeReimburse,
  listPeriodReimburse,
  listGrade,
}: props) {
  const formSchema = z.object({
    period: z.string('Period must choose'),
    type: z.string('Type must choose'),
    grade: z.string('Grade must choose'),
    limit: z.number('Limit must set'),
    plafon: z.number('Plafon must set'),
  });

  const defaultValues = {
    period: '',
    type: '',
    grade: '',
    limit: 0,
    plafon: 0,
  };

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

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
                            {listTypeReimburse.map((type) => (
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
                          value={field.value?.toString()}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='-' />
                          </SelectTrigger>
                          <SelectContent>
                            {listGrade.map((grade) => (
                              <SelectItem key={grade.id} value={grade.id.toString()}>
                                {grade.grade}
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
                          type='number'
                          placeholder='0.0'
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value || 0.0}
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
                          type='number'
                          placeholder='0'
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value || 0.0}
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
