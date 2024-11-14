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
import { Loading } from '@/components/commons/Loading';
import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';

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
    code: z.string(),
    name: z.string().min(1, 'Name is required'),
    is_employee: z.boolean(),
    limit: z.number(),
    material_group: z.number('Material Group must choose'),
    material_number: z.number('Material Number must choose'),
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

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { dataDropdown: dataMaterialGroup, getDropdown: getMaterialGroup } = useDropdownOptions();
  const { dataDropdown: dataMaterialNumber, getDropdown: getMaterialNumber } = useDropdownOptions();
  
  const defaultValues = {
    code: '',
    name: '',
    material_group: null,
    material_number: null,
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
      const data = response.data.data;
      
      form.reset({
        code: data.code,
        name: data.name,
        limit: data.limit,
        is_employee: data.is_employee,
        material_group: parseInt(data.material_group),
        material_number: parseInt(data.material_number),
        grade_option: data.grade_option,
        grade_all_price: data.grade_all_price,
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

  const handleSearchMaterialGroup = async (query: string) => {
    if (query.length > 0) {
      getMaterialGroup(query, {
        name: 'material_group',
        id: 'id',
        tabel: 'material_groups',
      });
    }
  };

  const handleSearchMaterialNumber = async (query: string) => {
    if (query.length > 0) {
      getMaterialNumber(query, {
        name: 'material_number',
        id: 'id',
        tabel: 'master_materials',
      });
    }
  };

  React.useEffect(() => {
    getMaterialGroup('', {
      name: 'material_group',
      id: 'id',
      tabel: 'material_groups',
    });
    
    getMaterialNumber('', {
      name: 'material_number',
      id: 'id',
      tabel: 'master_materials',
    });

    if (type === FormType.edit) {
      getDetailData();
    }
    
    document.body.style.removeProperty('pointer-events');
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
                          disabled={type === FormType.edit}
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
                          <td>Balance {grade.grade}</td>
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
                <FormAutocomplete<any>
                  options={dataMaterialGroup}
                  fieldName='material_group'
                  isRequired={true}
                  disabled={false}
                  placeholder={'Material Group'}
                  onSearch={handleSearchMaterialGroup}
                  classNames='mt-2 w-full'
                />
              </td>
            </tr>

            <tr>
              <td width={200}>Material Number</td>
              <td>
                <FormAutocomplete<any>
                  options={dataMaterialNumber}
                  fieldName='material_number'
                  isRequired={true}
                  disabled={false}
                  placeholder={'Material Number'}
                  onSearch={handleSearchMaterialNumber}
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
