import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/shacdn/form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/shacdn/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import '../css/index.scss';
import { ScrollArea } from '@/components/shacdn/scroll-area';
import { Separator } from '@/components/shacdn/separator';
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
import axios, { AxiosError } from 'axios';
import { CREATE_API_FAMILY, EDIT_FAMILY } from '@/endpoint/family/api';

interface propsType {
  onSuccess?: (value: boolean) => void;
  idUser?: string;
}

export const FamilyHeaderForm = ({ onSuccess, idUser }: propsType) => {
  const formSchema = z.object({
    total_family: z.string().min(1, 'Total Family is Required'),
    families: z.array(
      z.object({
        id: z.string(),
        status: z.string().min(1, 'Type Family is Must Choose'),
        bod: z.date(),
        name: z.string().min(1, 'Name Family is Required'),
      }),
    ),
  });

  const [activeTab, setActiveTab] = useState('family1');
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };


  const [totalFamily, setTotalFamily] = React.useState<string>('1');

  const handleFormCountChange = (value: any) => {
    setTotalFamily(value);
    const currentForms = form.getValues('families');
    const newForms = Array.from({ length: value }).map((_, index) => {
      return (
        currentForms[index] || {
          id: '',
          name: '',
          status: '',
          bod: new Date(),
        }
      );
    });
    form.setValue('families', newForms);
    form.setValue('total_family', value.toString());
  };

  async function getDetailData() {
    try {
      const response = await axiosInstance.get(EDIT_FAMILY(idUser ?? ''));
      const data = response.data.data;
      if (data && data.length > 0) {
        form.setValue('total_family', data.length.toString());
        form.setValue(
          'families',
          data.map((val) => ({
            id: val.id ?? '',
            status: val.status ?? '',
            name: val.name ?? '',
            bod: val.bod ? new Date(val.bod) : new Date(),
          })),
        );
      } else {
        form.setValue('total_family', '1');
        form.setValue('families', [
          {
            id: '',
            name: '',
            status: '',
            bod: new Date(),
          },
        ]);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast(error.message, 'error');
      } else {
        showToast('Unknown error occurred', 'error');
      }

      form.setValue('total_family', '1');
      form.setValue('families', [
        {
          id: '',
          name: '',
          status: '',
          bod: new Date(),
        },
      ]);
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updatedValues = {
        ...values,
        user: idUser
      };
      const response = await axiosInstance.post(CREATE_API_FAMILY, updatedValues);
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
      total_family: '1',
      families: [
        {
          id: '',
          status: '',
          bod: new Date(),
          name: '',
        },
      ],
    },
  });

  useEffect(() => {
    getDetailData();
  }, [totalFamily]);

  return (
    <ScrollArea className='h-[600px] w-full '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <table className='text-xs mt-4 reimburse-form-table font-thin'>
            <tr>
              <td width={200}>Total Member</td>
              <td>
                {' '}
                <FormField
                  control={form.control}
                  name='total_family'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => handleFormCountChange(value)}
                          value={field.value?.toString()}
                        >
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

          <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
            <TabsList className={'flex items-center justify-start space-x-4'}>
              {' '}
              {/* Flexbox for horizontal layout */}
              {Array.from({ length: form.watch('total_family') || 1 }).map((_, index) => (
                <TabsTrigger key={index} value={`family${index + 1}`}>
                  Member {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {Array.from({ length: form.watch('total_family') || 1 }).map((_, index) => (
              <TabsContent key={index} value={`family${index + 1}`}>
                <FormField
                  control={form.control}
                  name={`families.${index}.id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          className='sr-only'
                          {...field}
                          value={field.value.toString() || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div>
                  <table className='text-xs mt-4 reimburse-form-detail font-thin'>
                    <tr>
                      <td width={200}>
                        Name <span className='text-red-500'>*</span>
                      </td>
                      <td>
                        <FormField
                          control={form.control}
                          name={`families.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type='text'
                                  placeholder='John Doe'
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
                      <td width={200}>Family Type</td>
                      <td>
                        <FormField
                          control={form.control}
                          name={`families.${index}.status`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                                  <SelectTrigger className='w-[200px]'>
                                    <SelectValue placeholder='Child / Wife' />
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

                    <tr>
                      <td width={200}>Birth of Date</td>
                      <td>
                        <FormField
                          control={form.control}
                          name={`families.${index}.bod`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomDatePicker
                                  initialDate={
                                    field.value instanceof Date
                                      ? field.value
                                      : new Date(field.value)
                                  }
                                  onDateChange={(date) => field.onChange(date)}
                                />
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
            ))}
          </Tabs>
          <Separator className='my-4' />
          <div className='mt-4 flex justify-end'>
            <Button type='submit' className='w-32'>
              Update
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};

function showToast(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}