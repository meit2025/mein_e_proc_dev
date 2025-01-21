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
import { MultiSelect } from '@/components/commons/MultiSelect';
import { BusinessTripGrade } from '../../BusinessGrade/model/model';
import { MaterialModel } from '@/Pages/Master/MasterMaterial/model/listModel';
import { GET_LIST_MASTERIAL_BY_MATERIAL_GROUP } from '@/endpoint/masterMaterial/api';
import { FormType } from '@/lib/utils';
import { AsyncDropdownComponent } from '@/components/commons/AsyncDropdownComponent';
import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';
//

export enum AllowanceType {
  create,
  edit,
  update,
}

export interface AllowanceItemFormInterface {
  onSuccess?: (value: boolean) => void;
  type?: FormType;
  id?: string;
  editUrl?: string;
  detailUrl?: string;
  createUrl?: string;
  listCurrency: CurrencyModel[];
  listAllowanceCategory: AllowanceCategoryModel[];
  listGrade: BusinessTripGrade[];
  // listMaterial: MaterialModel[];
  // listMaterialGroup: string[];
}
export default function AllowanceItemForm({
  onSuccess,
  type = FormType.create,
  detailUrl,
  id,
  listCurrency,
  listAllowanceCategory,
  listGrade,
  // listMaterial,
  createUrl,
  editUrl,
  // listMaterialGroup,
}: AllowanceItemFormInterface) {
  const formSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    material_number: z.string().min(1, 'Material number required'),
    material_group: z.string().min(1, 'Material Group required'),
    currency_id: z.string().min(1, 'Currency is required'),
    // formula: z.string().min(1, 'Formula is required'),
    allowance_category_id: z.string().min(1, 'Allowance Category is required'),
    request_value: z.string().min(1, 'Required'),
    grade_all_price: z.string().optional(),
    grade_option: z.string().min(1, 'Grade must be selected'),
    grades: z.array(
      z.object({
        grade: z.string(),
        id: z.number(),
        plafon: z.string(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    // Validasi jika grade_option adalah 'grade'
    if (data.grade_option === 'grade') {
      if (data.grades.length === 0) {
        // Jika array grades kosong
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['grades'],
          message: 'At least one grade is required when grade_option is "grade".',
        });
      } else {
        // Validasi setiap elemen dalam array grades
        data.grades.forEach((grade, index) => {
          if (!grade.grade || grade.grade.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
              path: ['grades', index, 'grade'],
              message: 'Grade is required.',
            });
          }
          if (type == FormType.create && (!grade.plafon || grade.plafon.trim() === '')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['grades', index, 'plafon'],
                message: 'Plafon is required.',
            });
        }
        });
      }
    }
  });

  const [materials, setMaterials] = React.useState([]);
  const [materialURL, setMaterialURL] = React.useState('');

  const defaultValues = {
    code: '',
    name: '',
    type: '',
    currency_id: '',
    // formula: '',
    allowance_category_id: '',
    request_value: 'unlimited',
    grade_option: 'all',
    grade_all_price: '0',
    grades: [],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const { dataDropdown: dataMaterialGroup, getDropdown: getMaterialGroup } = useDropdownOptions();
  const { dataDropdown: dataMaterialNumber, getDropdown: getMaterialNumber } = useDropdownOptions();

  //   console.log('currency_id', listCurrency);
  async function getDetailData() {
    try {
      const response = await axiosInstance.get(detailUrl ?? '');

      const allowance = response.data.data.allowance;
    //   console.log(response);
    //   getMaterials(allowance.material_group);
        getMaterialNumber('', {
            name: 'material_description',
            id: 'material_number',
            tabel: 'master_materials',
            attribut: allowance.material_group,
            isMapping: true,
            where: {
            key: 'material_group',
            parameter: allowance.material_group,
            },
        });

      const grades = response.data.data.grades;
        console.log(grades)
      form.reset({
        code: allowance.code,
        name: allowance.name,
        type: allowance.type,
        material_number: allowance.material_number,
        material_group: allowance.material_group,
        currency_id: allowance.currency_id,
        // formula: allowance.formula,
        allowance_category_id: allowance.allowance_category_id,
        //   request_value: allowance.request_value,
        grade_option: allowance.grade_option,
        grade_all_price: allowance.grade_all_price,
        grades: grades,
      });

      // form.setValue('material_number', allowance.material_number);
      // form.setValue('request_value', allowance.request_value);
      form.setValue('request_value', allowance.request_value);
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
    try {
      console.log(values);
      if (type === FormType.create) {
        const response = await axiosInstance.post(createUrl ?? '', values);
      } else if (type === FormType.edit) {
        const response = await axiosInstance.put(editUrl ?? '', values);
      }

      showToast('success', 'success');
      onSuccess?.(true);
    } catch (e) {
      if (e.response) {
        // console.log(e.response.data.data);
        showToast(e.response.data.message, 'error');
      }
    }
  };

  async function getMaterials(material_group: string) {
    try {
      const response = await axiosInstance.get(
        GET_LIST_MASTERIAL_BY_MATERIAL_GROUP(material_group),
      );

      form.setValue('material_group', material_group);

      setMaterials(response.data.data);
    } catch (e) {
      console.log(e);
    }
  }

  // React.useEffect(() => {
  //   if (id && type == AllowanceType.edit) {
  //     getDetailData();
  //   }
  // }, [id, type]);


  React.useEffect(() => {
    if (type === FormType.detail || type === FormType.edit) {
      getDetailData();
    }
    getMaterialGroup('', {
        name: 'material_group_desc',
        id: 'material_group',
        tabel: 'material_groups',
        idType: 'string',
    });
  }, [type]);



  const handelGetMaterialNumber = async (value: string) => {
    getMaterialNumber('', {
      name: 'material_description',
      id: 'material_number',
      tabel: 'master_materials',
      attribut: value,
      isMapping: true,
      where: {
        key: 'material_group',
        parameter: value,
      },
    });
  };


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
                            <SelectItem key='DAILY' value='daily'>
                              DAILY
                            </SelectItem>
                            <SelectItem key='TOTAL' value='total'>
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
              <td width={200}>Material Group</td>
              <td>
                {/* <FormField
                  control={form.control}
                  name='material_group'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AsyncDropdownComponent
                          onSelectChange={(value) => {
                            field.onChange(value);

                            setMaterialURL(
                              'api/master/master-material/get-dropdown-master-material-number/by-material-group/' +
                                value,
                            );

                            form.setValue('material_number', '');
                          }}
                          value={field.value}
                          placeholder='Select material group'
                          filter={['material_group']}
                          id='material_group'
                          label='material_group'
                          url='api/master/master-material/get-dropdown-master-material-group'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormAutocomplete<any>
                    fieldLabel=''
                    options={dataMaterialGroup}
                    fieldName='material_group'
                    isRequired={true}
                    disabled={false}
                    placeholder={'Select Material Group'}
                    classNames='mt-2 w-full'
                    onChangeOutside={async (value: string, data: any) => {
                        await handelGetMaterialNumber(value);
                    }}
                />
              </td>
            </tr>
            <tr>
              <td width={200}>Material Number</td>
              <td>
              <FormAutocomplete<any>
                fieldLabel=''
                options={dataMaterialNumber}
                fieldName={'material_number'}
                isRequired={false}
                disabled={false}
                placeholder={'Material number'}
                classNames='mt-2 w-full'
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
            {/*
            <tr>
              <td width={200}>Purpose Type</td>
              <td>
                <ScrollArea className='h-[250px] border rounded-lg p-6 w-full'></ScrollArea>
              </td>
            </tr> */}
            {/* <tr>
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
            </tr> */}
            <tr>
              <td width={200}>Grade</td>
              <td className='gap-4'>
                <FormField
                  control={form.control}
                  name='grade_option'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)} // Pass selected value to React Hook Form
                          value={field.value} // Set the current value from React Hook Form
                        >
                          <SelectTrigger className='w-[200px] mb-3'>
                            <SelectValue placeholder='Select Request Value' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key='all' value='all'>
                              All
                            </SelectItem>
                            <SelectItem key='grade' value='grade'>
                              grade
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    // <FormItem>
                    //   <FormControl>
                    //     <RadioGroup
                    //       onValueChange={field.onChange}
                    //       defaultValue={field.value}
                    //       className='flex flex space-x-1'
                    //     >
                    //       <FormItem className='flex text-xs items-center space-x-3 space-y-0'>
                    //         <FormControl>
                    //           <RadioGroupItem value='all' />
                    //         </FormControl>
                    //         <FormLabel className='text-xs'>All</FormLabel>
                    //       </FormItem>
                    //       <FormItem className='flex items-center space-x-3 space-y-0'>
                    //         <FormControl>
                    //           <RadioGroupItem value='grade' />
                    //         </FormControl>
                    //         <FormLabel className='text-xs'>Grade</FormLabel>
                    //       </FormItem>
                    //     </RadioGroup>
                    //   </FormControl>
                    // </FormItem>
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
                      options={listGrade}
                      value={form.getValues('grades').map((item) => item.id)}
                      isHidden='hidden'
                      onSelect={(value) => {
                        const currentGrades = form.getValues('grades');
                        form.setValue(
                          'grades',
                          value.map((item) => {
                            const existingGrade = currentGrades.find((grade) => grade.id === item.id);
                            return {
                                id: item.id,
                                grade: item.grade,
                                plafon: existingGrade ? existingGrade.plafon : '', // Pertahankan plafon jika ada
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
                        <tr key={gradeIndex}>
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
                                    <Input {...field}/>
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
              <td width={200}>Request Value</td>
              <td>
                <FormField
                  control={form.control}
                  name='request_value'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)} // Pass selected value to React Hook Form
                          value={field.value} // Set the current value from React Hook Form
                        >
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Select Request Value' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key='unlimited' value='unlimited'>
                              Unlimited
                            </SelectItem>
                            <SelectItem key='up to max value' value='up to max value'>
                              Up to Max Value
                            </SelectItem>
                            <SelectItem key='fixed value' value='fixed value'>
                              Fixed Value
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    // <FormItem>
                    //   <FormControl>
                    //     <RadioGroup
                    //       onValueChange={field.onChange}
                    //       defaultValue={field.value}
                    //       className='flex flex space-x-1'
                    //     >
                    //       <FormItem className='flex text-xs items-center space-x-3 space-y-0'>
                    //         <FormControl>
                    //           <RadioGroupItem value='unlimited' />
                    //         </FormControl>
                    //         <FormLabel className='text-xs'>Unlimited</FormLabel>
                    //       </FormItem>
                    //       <FormItem className='flex items-center space-x-3 space-y-0'>
                    //         <FormControl>
                    //           <RadioGroupItem value='up to max value' />
                    //         </FormControl>
                    //         <FormLabel className='text-xs'>Up To Max Value</FormLabel>
                    //       </FormItem>
                    //       <FormItem className='flex items-center space-x-3 space-y-0'>
                    //         <FormControl>
                    //           <RadioGroupItem value='fixed value' />
                    //         </FormControl>
                    //         <FormLabel className='text-xs'>Fixed Value</FormLabel>
                    //       </FormItem>
                    //     </RadioGroup>
                    //   </FormControl>
                    // </FormItem>
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
