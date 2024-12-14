import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/shacdn/form';
  
  import { z } from 'zod';
  
  import { Inertia } from '@inertiajs/inertia';
  
  import { Button } from '@/components/shacdn/button';
  import { ChevronsUpDown } from 'lucide-react';
  
  import { Textarea } from '@/components/shacdn/textarea';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { useFieldArray, useForm, useWatch } from 'react-hook-form';
  
  import { ScrollArea } from '@/components/shacdn/scroll-area';
  import { Separator } from '@/components/shacdn/separator';
  import '../css/index.scss';
  
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';
  
  import axiosInstance from '@/axiosInstance';
  import { CustomDatePicker } from '@/components/commons/CustomDatePicker';
  import {
    WorkflowApprovalDiagramInterface,
    WorkflowApprovalStepInterface,
    WorkflowComponent,
  } from '@/components/commons/WorkflowComponent';
  import FormSwitch from '@/components/Input/formSwitchCustom';
  import { Input } from '@/components/shacdn/input';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/shacdn/select';
  import { useAlert } from '@/contexts/AlertContext';
  import {
    CREATE_API_BUSINESS_TRIP,
    EDIT_API_BUSINESS_TRIP,
    GET_DETAIL_BUSINESS_TRIP,
    GET_LIST_COST_CENTER,
    GET_LIST_DESTINATION,
    GET_LIST_EMPLOYEE,
    GET_LIST_PURCHASING_GROUP,
    GET_LIST_PURPOSE_TYPE,
    GET_LIST_TAX,
  } from '@/endpoint/business-trip/api';
  import {
    GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE,
    GET_DETAIL_PURPOSE_TYPE,
  } from '@/endpoint/purpose-type/api';
  import { Button as ButtonMui } from '@mui/material';
  import axios, { AxiosError } from 'axios';
  import moment from 'moment';
  import * as React from 'react';
  import { DestinationModel } from '../../Destination/models/models';
  import { PurposeTypeModel } from '../../PurposeType/models/models';
  import {
    AllowanceItemModel,
    BusinessTripType,
    Costcenter,
    Pajak,
    PurchasingGroup,
  } from '../models/models';
  import { GET_LIST_DESTINATION_BY_TYPE } from '@/endpoint/destination/api';
  import useDropdownOptions from '@/lib/getDropdown';
  import FormAutocomplete from '@/components/Input/formDropdown';
  import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
  import { Combobox } from '@/components/shacdn/combobox';
  
  interface User {
    id: string;
    nip: string;
    name: string;
  }
  
  interface Type {
    id: string;
    code: string;
    name: string;
  }
  
  interface CurrencyModel {
    id: string;
    code: string;
  }
  
  interface BusinessTripAttachement {
    id: number;
    url: string;
    file_name: string;
  }
  
  interface Props {
    users: User[];
    listPurposeType: PurposeTypeModel[];
  }
  
export function DetailAttedances({
    form,
    destinationIndex,
    detailAttedanceFields,
    updateAttedanceFields,
  }: {
    form: any;
    destinationIndex: number;
    detailAttedanceFields: any;
    updateAttedanceFields: any;
  }) {
    const detailAttedanceWatch = form.watch(`destinations.${destinationIndex}.detail_attedances`);
  
    React.useEffect(() => {}, [detailAttedanceWatch]);
  
    React.useEffect(() => {
      // console.log(detailAttedanceFields, ' Detail Attedance fields');
    }, [detailAttedanceFields]);
    return (
      <table className='text-xs mt-4 reimburse-form-detail font-thin'>
        <tr>
          <td colSpan={2}>
            <div className='mb-4 text-sm'>Detail Attedance: </div>
          </td>
        </tr>
        <tr>
          <td>
            <table className='detail-attedance text-xs'>
              <thead>
                <th>Date</th>
                <th>Shift code</th>
                <th>Shift Start</th>
                <th>Shift End</th>
                <th>Start Time</th>
                <th>End Time</th>
              </thead>
              <tbody>
                {detailAttedanceFields.map((attedance: any, index: any) => (
                  <tr key={attedance.index}>
                    <td>
                      {moment(attedance.date).format('DD/MM/YYYY')}
  
                      <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.detail_attedances.${index}.date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                defaultValue={moment(field.value).format('YYYY-MM-DD')}
                                onChange={field.onChange}
                                type='hidden'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
  
                    <td>
                      {attedance.shift_code}
                      <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.detail_attedances.${index}.shift_code`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                defaultValue={moment(field.value).format('YYYY-MM-DD')}
                                onChange={field.onChange}
                                type='hidden'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td>
                      {attedance.shift_start}
                      <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.detail_attedances.${index}.shift_start`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                defaultValue={moment(field.value).format('YYYY-MM-DD')}
                                onChange={field.onChange}
                                type='hidden'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td>
                      {attedance.shift_end}
                      <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.detail_attedances.${index}.shift_end`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                defaultValue={moment(field.value).format('YYYY-MM-DD')}
                                onChange={field.onChange}
                                type='hidden'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td>
                      <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.detail_attedances.${index}.start_time`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input defaultValue={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td>
                      <FormField
                        control={form.control}
                        name={`destinations.${destinationIndex}.detail_attedances.${index}.end_time`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input defaultValue={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    );
  }