import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel
} from '@/components/shacdn/form';

import { z } from 'zod';

import { Button } from '@/components/shacdn/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import { ScrollArea } from '@/components/shacdn/scroll-area';
import '../css/index.scss';
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
import { MultiSelect } from '@/components/commons/MultiSelect';
import { RadioGroup, RadioGroupItem } from '@/components/shacdn/radio-group';
import { CREATE_API_REIMBURSE_TYPE } from '@/endpoint/reimburseType/api';
import useDropdownOptions from '@/lib/getDropdown';
import { Loading } from '@/components/commons/Loading';

export interface props {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  listGrades?: Grade[];
  editURL?: string,
  updateURL?: string,
  id?: string;
}

export default function ReimburseTypeForm({
  onSuccess,
  type = FormType.create,
  listGrades,
  editURL,
  updateURL,
  id,
}: props) {
  const formSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    is_employee: z.boolean(),
    limit: z.number().min(1, 'Limit Number Must input >= 1'),
    material_group: z.string().min(1, 'Material group required'),
    material_number: z.string().min(1, 'Material number required'),
    grade_option: z.string().min(1, 'Grade must be selected'),
    grade_all_price: z.string().optional(),
    grades: z.array(
      z.object({
        grade: z.string(),
        id: z.number(),
        plafon: z.string(),
      }),
    ),
  });

  const { dataDropdown: materialGroup, getDropdown: getMaterialGroup } = useDropdownOptions();
  const { dataDropdown: materialNumber, getDropdown: getMaterialNumber } = useDropdownOptions();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const defaultValues = {
    code: '',
    name: '',
    is_employee: true,
    grade_option: 'all',
    grade_all_price: '0',
    grades: [],
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
        code: data.code.toString(),
        name: data.name.toString(),
        limit: data.limit.toString(),
        is_employee: data.is_employee.toString(),
        material_group: data.material_group.toString(),
        material_number: data.material_number.toString(),
        grade_option: data.grade_option.toString(),
        grade_all_price: data.grade_all_price.toString(),
        grades: data.grades,
      });
    } catch (e) {
      const error = e as AxiosError;
    }
  }

  const { fields: gradeFields } = useFieldArray({
    control: form.control,
    name: `grades`,
  });

  const { showToast } = useAlert();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      let response;
      if (type === FormType.edit) {
        response = await axiosInstance.put(updateURL ?? '', values);
      } else {
        response = await axiosInstance.post(CREATE_API_REIMBURSE_TYPE ?? '', values);
      }

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
  }, []);

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
              <td width={200}>Grade</td>
              <td>
                <FormField
                  control={form.control}
                  name='grade_option'
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
                              <RadioGroupItem value='all' />
                            </FormControl>
                            <FormLabel className='text-xs'>All</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='grade' />
                            </FormControl>
                            <FormLabel className='text-xs'>Grade</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.getValues('grade_option') === 'all' ? (
                  <div>
                    <FormField
                      control={form.control}
                      name='grade_all_price'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div>
                    <MultiSelect
                      label='grade'
                      id='id'
                      options={listGrades}
                      value={form.getValues('grades').map((item) => item.id)}
                      onSelect={(value) => {
                        form.setValue(
                          'grades',
                          value.map((item) => {
                            return {
                              id: item.id,
                              grade: item.grade,
                              plafon: 0,
                            };
                          }),
                        );
                      }}
                    />
                  </div>
                )}

                {form.getValues('grade_option') === 'grade' ? (
                  <div className='mt-4'>
                    <table>
                      {gradeFields.map((grade, gradeIndex) => (
                        <tr key={grade}>
                          <td>Grade {grade.grade}</td>
                          <td>:</td>
                          <td>
                            <div>
                              <FormField
                                control={form.control}
                                name={`grades.${gradeIndex}.plafon`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                ) : null}
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
