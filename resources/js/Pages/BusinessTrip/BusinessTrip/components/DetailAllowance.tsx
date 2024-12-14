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
  import { BussinessDestinationForm } from './BussinessDestinationForm';
  
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
  

export function DetailAllowance({
    form,
    destinationIndex,
    allowanceField,
  }: {
    form: any;
    destinationIndex: number;
    allowanceField: any;
  }) {
    return (
      <table className='w-full allowance-table'>
        {allowanceField.map((allowance: any, index: any) => (
          <AllowanceRowInput
            form={form}
            allowance={allowance}
            destinationIndex={destinationIndex}
            allowanceIndex={index}
          />
        ))}
      </table>
    );
  }
  
  export function AllowanceRowInput({
    form,
    allowance,
    destinationIndex,
    allowanceIndex,
  }: {
    form: any;
    allowance: any;
    destinationIndex: any;
    allowanceIndex: any;
  }) {
    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
    const handleClikRow = (index: number) => {
      setIsExpanded((prev) => !prev);
    };
    // Memantau base price jika allowance.type === 'TOTAL'
    const basePrice = useWatch({
      control: form.control,
      name: `destinations.${destinationIndex}.allowances.${allowanceIndex}.detail.${0}.request_price`, // pastikan memantau field request_price
    });
  
    // Memantau semua detail harga jika allowance.type !== 'TOTAL'
    const details = useWatch({
      control: form.control,
      name: `destinations.${destinationIndex}.allowances.${allowanceIndex}.detail`,
    });
  
    const calculateTotal = () => {
      if (allowance.type === 'total') {
        // Pastikan basePrice tidak NaN atau undefined
        const price = parseFloat(basePrice || 0);
        return price * 1; // Menghitung total dengan basePrice
      } else {
        let total = 0;
        details?.forEach((detail: any) => {
          const price = parseFloat(detail.request_price || 0); // Pastikan parsing harga detail
          total += price; // Menghitung total dari setiap detail
        });
        return total;
      }
    };
  
    const handleInputChange = (field: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value) || 0;
  
      if (allowance.request_value === 'unlimited') {
        // No restrictions on input value
        field.onChange(event);
      } else if (allowance.request_value === 'up to max value') {
        if (value <= allowance.subtotal) {
          field.onChange(event);
        } else {
          alert(`Value cannot exceed the subtotal of IDR ${allowance.subtotal}`);
        }
      } else if (allowance.request_value === 'fixed value') {
        // Do not allow changes for fixed value
        alert('This value is fixed and cannot be changed.');
      }
    };
    return (
      <>
        <tr key={allowance.id}>
          <td width={220} style={{ verticalAlign: 'middle' }} className='text-sm'>
            {allowance.name}
          </td>
          <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>:</td>
          <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
            {allowance.type == 'total' ? <span className='text-sm'>IDR</span> : <span></span>}
          </td>
          <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
            {allowance.type == 'total' ? (
              <div className='flex items-center'>
                <FormField
                  control={form.control}
                  name={`destinations.${destinationIndex}.allowances.${allowanceIndex}.detail.${0}.request_price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input value={field.value} onChange={handleInputChange(field)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className='text-sm'>* 100%</span>
              </div>
            ) : (
              <span className='text-sm'>
                {' '}
                {allowance.detail.length} Days * {formatRupiah(allowance.subtotal)} * 100%
              </span>
            )}
          </td>
          <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
            <div className='flex items-center'>
              <span className='text-sm' style={{ padding: '2px 5px' }}>
                = IDR {formatRupiah(calculateTotal())}
              </span>
            </div>
          </td>
          {allowance.type == 'total' ? (
            <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}></td>
          ) : (
            <td
              style={{ verticalAlign: 'middle', padding: '2px 5px' }}
              onClick={() => handleClikRow(allowanceIndex)}
            >
              <Button variant='ghost' type='button' size='sm' className='w-9 p-0'>
                <ChevronsUpDown className='h-4 w-4' />
                <span className='sr-only'>Toggle</span>
              </Button>
            </td>
          )}
        </tr>
  
        {isExpanded && (
          <>
            {allowance.detail.map((detail: any, detailIndex: number) => (
              <tr key={detail.id}>
                <td className='text-end' style={{ verticalAlign: 'middle' }}>
                  <span className='text-sm'>{moment(detail.date).format('DD/MM/YYYY')}</span>{' '}
                </td>
                <td style={{ padding: '8px 2px', verticalAlign: 'middle' }}>:</td>
                <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
                  <span className='text-sm'>IDR</span>
                </td>
                <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}>
                  <div className='flex mt-1 text-sm justify-between items-center'>
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.allowances.${allowanceIndex}.detail.${detailIndex}.request_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              value={field.value} // Ensure proper value binding
                              // onChange={field.onChange} // Bind change handler to form control
                              onChange={handleInputChange(field)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}></td>
                <td style={{ verticalAlign: 'middle', padding: '2px 5px' }}></td>
              </tr>
            ))}
          </>
        )}
      </>
    );
  }