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
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';

export interface props {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  listGrades?: Grade[];
  editURL?: string;
  updateURL?: string;
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
    family_status: z.string().optional(),
    interval_claim_period: z.number().nullable(),
    limit: z.any(),
    material_group: z.number().refine((val) => val > 0, {
      message: 'Material Group must be chosen',
    }),
    material_number: z.number().refine((val) => val > 0, {
      message: 'Material Number must be chosen',
    }),
    grade_option: z.string().min(1, 'Grade must be selected'),
    grade_all_price: z.string().optional(),
    grades: z.array(
      z.object({
        grade: z.string(),
        id: z.number(),
        plafon: z.string().min(1, 'Balance required'),
      }),
    ),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { dataDropdown: dataMaterialGroup, getDropdown: getMaterialGroup } = useDropdownOptions('api/master-pr/material-group/dropdown-list');
  const { dataDropdown: dataMaterialNumber, getDropdown: getMaterialNumber } = useDropdownOptions('api/master/master-material/get-dropdown-master-material-number');
  const dayOnYear = 365;
  const dataIntervalClaimPeriod = [
    {
      label: '1 Year',
      value: dayOnYear * 1
    },
    {
      label: '2 Year',
      value: dayOnYear * 2
    }
  ];

  const defaultValues = {
    code: '',
    name: '',
    material_group: null,
    material_number: null,
    family_status: '',
    interval_claim_period: null,
    is_employee: true,
    grade_option: 'all',
    grade_all_price: '',
    grades: [],
    limit: null,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function getDetailData() {
    try {
      const response = await axiosInstance.get(editURL || '');
      const data = response.data.data;
      
      form.reset({
        code: data.code,
        name: data.name,
        limit: data.limit,
        is_employee: data.is_employee,
        family_status: data.family_status,
        interval_claim_period: data.interval_claim_period ? parseInt(data.interval_claim_period) : null,
        material_group: parseInt(data.material_group.id),
        material_number: parseInt(data.material_number),
        grade_option: data.grade_option,
        grade_all_price: data.grade_all_price,
        grades: data.grades,
      });

      handleChangeMaterialGroup(data.material_group.material_group || '')
    } catch (e) {
      const error = e as AxiosError;
    }
  }

  const { fields: gradeFields } = useFieldArray({
    control: form.control,
    name: 'grades',
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
    } catch (e: any) {
      onSuccess && onSuccess(false);
      const errorMessage = e.response?.data?.message ?? e.message;
      showToast(errorMessage, 'error');
    }
    setIsLoading(false);
  };

  const handleChangeMaterialGroup = async (query: string) => {
    if (query.length > 0) {
      getMaterialNumber(query, {
        name: 'material_number',
        id: 'id',
        tabel: 'master_materials',
        where: {
          key: 'material_group',
          parameter: query,
        },
        hasValue: {
          key: form.getValues('material_number') ? 'id' : '',
          value: form.getValues('material_number') ?? '',
        }
      });
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (type === FormType.edit) {
        await getDetailData();
      }
      getMaterialGroup('', {
        name: 'material_group',
        id: 'id',
        tabel: 'material_groups',
        hasValue: {
          key: form.getValues('material_group') ? 'id' : '',
          value: form.getValues('material_group') ?? '',
        }
      });
    };
    fetchData();
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
              <td width={200}>Family Status</td>
              <td>
                <FormField
                  control={form.control}
                  name='family_status'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                          disabled={form.getValues('is_employee') === true}
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Select Family' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='husband'>Husband</SelectItem>
                            <SelectItem value='wife'>Wife</SelectItem>
                            <SelectItem value='child'>Child</SelectItem>
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
                Limit Request
                <p className='text-xs italic text-slate-400'>( Clear the form input to set an unlimited limit for the request reimbursement )</p>
              </td>
              <td>
                <FormField
                  control={form.control}
                  name='limit'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          onChange={(e) => field.onChange(parseInt(e.target.value.replace(/[^0-9]/g, '')) || '')}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </td>
            </tr>

            <tr>
              <td className='block' width={200}>Balance</td>
              <td>
                <FormField
                  control={form.control}
                  name='grade_option'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className='flex flex space-x-1 mb-3'
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
                            <Input
                              type='text'
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                const formattedValue = formatRupiah(rawValue, false);
                                field.onChange(rawValue);
                                e.target.value = formattedValue;
                              }}
                              value={formatRupiah(String(field.value), false) || 0}
                            />
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
                      options={listGrades || []}
                      value={form.getValues('grades').map((item) => item.id)}
                      onSelect={(value) => {
                        form.setValue(
                          'grades',
                          value.map((item: any, key: any) => {
                            return {
                              id: item.id,
                              grade: item.grade,
                              plafon: form.getValues('grades')?.[key]?.plafon || '0',
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
                          <td>Balance Grade {grade.grade}</td>
                          <td>:</td>
                          <td>
                            <div>
                              <FormField
                                control={form.control}
                                name={`grades.${gradeIndex}.plafon`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        type='text'
                                        placeholder='0'
                                        onChange={(e) => {
                                          const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                          const formattedValue = formatRupiah(rawValue, false);
                                          field.onChange(rawValue);
                                          e.target.value = formattedValue;
                                        }}
                                        value={formatRupiah(field.value, false)}
                                      />
                                    </FormControl>
                                    <FormMessage />
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
              <td width={200}>Interval Claim Period</td>
              <td>
                <FormAutocomplete<any>
                  options={dataIntervalClaimPeriod}
                  fieldName='interval_claim_period'
                  placeholder={'Select Interval'}
                  classNames='mt-2 w-full'
                  fieldLabel={''}
                />
              </td>
            </tr>

            <tr>
              <td width={200}>Material Group</td>
              <td>
                <FormAutocomplete<any>
                  fieldLabel={''}
                  options={dataMaterialGroup}
                  fieldName='material_group'
                  isRequired={true}
                  disabled={false}
                  placeholder={'Material Group'}
                  classNames='mt-2 w-full'
                  onSearch={(search) => {
                    const isLabelMatch = dataMaterialGroup?.some(option => option.label === search);
                    if (search.length > 0 && !isLabelMatch) {
                      getMaterialGroup('', {
                        name: 'material_group',
                        id: 'id',
                        tabel: 'material_groups',
                        search: search,
                      });
                    } else if (search.length == 0 && !isLabelMatch) {
                      getMaterialGroup('', {
                        name: 'material_group',
                        id: 'id',
                        tabel: 'material_groups',
                      });
                    }
                  }}
                  onChangeOutside={async (x: any, data: any) => {
                    await handleChangeMaterialGroup(data?.label.split(' - ')[1]);
                  }}
                  onFocus={async () => {
                    let value = form.getValues('material_group');
                    await getMaterialGroup('', {
                      name: 'material_group',
                      id: 'id',
                      tabel: 'material_groups',
                      hasValue: {
                        key: value ? 'id' : '',
                        value: value ?? '',
                      }
                    });
                  }}
                />
              </td>
            </tr>

            <tr>
              <td width={200}>Material Number</td>
              <td>
                <FormAutocomplete<any>
                  fieldLabel={''}
                  options={dataMaterialNumber}
                  fieldName='material_number'
                  isRequired={true}
                  disabled={false}
                  placeholder={'Material Number'}
                  classNames='mt-2 w-full'
                  onSearch={(search) => {
                    const selectedMaterialGroup = form.getValues('material_group');
                    const selectedMaterialGroupLabel = dataMaterialGroup.find(item => item.value === selectedMaterialGroup)?.label;
                    const isLabelMatch = dataMaterialNumber?.some(option => option.label === search);
                    if (search.length > 0 && !isLabelMatch) {
                      getMaterialNumber('', {
                        name: 'material_number',
                        id: 'id',
                        tabel: 'master_materials',
                        where: {
                          key: 'material_group',
                          parameter: selectedMaterialGroupLabel?.split(' - ')[1],
                        },
                        search: search,
                      });
                    } else if (search.length == 0 && !isLabelMatch) {
                      getMaterialNumber('', {
                        name: 'material_number',
                        id: 'id',
                        tabel: 'master_materials',
                        where: {
                          key: 'material_group',
                          parameter: selectedMaterialGroupLabel?.split(' - ')[1],
                        },
                      });
                    }
                  }}
                  onFocus={() => {
                    const selectedMaterialGroup = form.getValues('material_group');
                    const selectedMaterialGroupLabel = dataMaterialGroup.find(item => item.value === selectedMaterialGroup)?.label;
                    let value = form.getValues('material_number');
                    getMaterialNumber('', {
                      name: 'material_number',
                      id: 'id',
                      tabel: 'master_materials',
                      where: {
                        key: 'material_group',
                        parameter: selectedMaterialGroupLabel?.split(' - ')[1],
                      },
                      hasValue: {
                        key: value ? 'id' : '',
                        value: value ?? '',
                      }
                    });
                  }}
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