import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/shacdn/form';

import { z } from 'zod';

import { Inertia } from '@inertiajs/inertia';

import { Button } from '@/components/shacdn/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldArray, useFieldArray, useForm } from 'react-hook-form';
import { Textarea } from '@/components/shacdn/textarea';

import '../css/index.scss';
import { ScrollArea } from '@/components/shacdn/scroll-area';
import { Separator } from '@/components/shacdn/separator';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';

import moment from 'moment';
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
import { FamilyModel, UserModel } from '../models/models';
import { Item } from '@radix-ui/react-dropdown-menu';
import axios, { AxiosError } from 'axios';
import FormSwitch from '@/components/Input/formSwitchCustom';
import FormAutocomplete from '@/components/Input/formDropdown';
import { CREATE_API_FAMILY, GET_DETAIL_FAMILY } from '@/endpoint/family/api';
import { FormType } from '@/lib/utils';
import { Family } from '@/Pages/Reimburse/model/listModel';

interface propsType {
  user: UserModel[];
  onSuccess?: (value: boolean) => void;
  id?: string;
  type?: FormType;
}

export const FamilyHeaderForm = ({ onSuccess, type = FormType.create, id, user }: propsType) => {
  const formSchema = z.object({
    user: z.string().min(1, 'Choose Employee is Required'),
    total_family: z.number().min(1, 'Total Family is Required'),
    families: z.array(
      z.object({
        status: z.string().min(1, 'Type Family is Must Choose'),
        bod: z.date(),
        name: z.string().min(1, 'Name Family is Required'),
      }),
    ),
  });
  const [totalFamily, setTotalFamily] = React.useState<string>('1');

  async function getDetailData() {
    let url = GET_DETAIL_FAMILY(id);

    try {
      let response = await axiosInstance.get(url);

      form.reset({
        id: response.data.data.id,
      });
    } catch (e) {
      let error = e as AxiosError;
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axiosInstance.post(CREATE_API_FAMILY, values);
      onSuccess?.(true);
      showToast(response.message, 'success');
    } catch (e) {
      onSuccess?.(false);
      showToast(e.message, 'error');
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: '',
      total_family: 1,
      families: [
        {
          status: '',
          bod: new Date(),
          name: '',
        },
      ],
    },
  });

  const totalFamilyHandler = (value: string) => {
    let valueToInt = parseInt(value);
    setTotalFamily(value);
  };

  function getUser() {}

  const {
    fields: familyField,
    append,
    remove,
    update: updateFamily,
  } = useFieldArray({
    control: form.control,
    name: 'families',
  });

  return (
    <ScrollArea className='h-[600px] w-full '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <table className='text-xs mt-4 reimburse-form-table font-thin'>
            <tr>
              <td width={200}>Employee Name</td>
              <td>
                <FormField
                  control={form.control}
                  name='user'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                          >
                            <SelectTrigger className='w-[200px] py-2'>
                              <SelectValue placeholder='-' />
                            </SelectTrigger>
                            <SelectContent>
                              {user.map((item) => (
                                <SelectItem key={item.nip} value={item.nip}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </td>
            </tr>

            <tr>
              <td width={200}>Total Destination</td>
              <td>
                {' '}
                <FormField
                  control={form.control}
                  name='total_family'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={totalFamily} onValueChange={totalFamilyHandler}>
                          <SelectTrigger className='w-[200px] py-2'>
                            <SelectValue placeholder='-' />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 5 }, (_, index) => (
                              <SelectItem value={(index + 1).toString()}> {index + 1} </SelectItem>
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

          <Separator className='my-4' />

          <TabFamily
            form={form}
            familyField={familyField}
            totalFamily={form.getValues('total_family').toString()}
          />

          <Button type='submit'>submit</Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export function TabFamily({
  form,
  familyField,
  totalFamily,
}: {
  form: any;
  familyField: any;
  totalFamily: string;
}) {
  return (
    <Tabs defaultValue='family1' className='w-full'>
      <TabsList className={`flex items-center justify-start space-x-4`}>
        {familyField.map((field: any, index: number) => (
          <TabsTrigger value={`family${index + 1}`}>Family {index + 1}</TabsTrigger>
        ))}
      </TabsList>

      {familyField.map((family: any, index: number) => (
        <FamilyForm form={form} index={index} />
      ))}
    </Tabs>
  );
}

export function FamilyForm({
  family,
  form,
  index,
}: {
  family: Family[];
  form: any;
  index: number;
}) {
  return (
    <TabsContent value={`family${index + 1}`}>
      <div key={index}>
        <table className='text-xs mt-4 reimburse-form-detail font-thin'>
          <tr>
            <td width={200}>Family Type</td>
            <td>
              <FormField
                control={form.control}
                name={`families.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          updateFamily(index, { ...family, family: value });
                        }}
                        defaultValue=''
                      >
                        <SelectTrigger className='w-[200px]'>
                          <SelectValue placeholder='Destination' />
                        </SelectTrigger>
                        <SelectContent>
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
        </table>
      </div>
    </TabsContent>
  );
}

function showToast(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}

function onSuccess(arg0: boolean) {
  throw new Error('Function not implemented.');
}
