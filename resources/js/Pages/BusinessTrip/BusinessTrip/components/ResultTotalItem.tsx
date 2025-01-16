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

export function ResultTotalItem({
    allowanceField,
    destinationIndex,
    form,
    setTotalAllowance,
  }: {
    allowanceField: any;
    destinationIndex: number;
    form: any;
    setTotalAllowance: any;
  }) {
    const [grandTotal, setGrandTotal] = React.useState(0);
  
    React.useEffect(() => {
      // Hitung ulang total allowance setiap kali allowanceField atau form berubah
      const newTotal = allowanceField.reduce((totalSum: number, allowance: any, index: number) => {
        const details = form.getValues(`destinations.${destinationIndex}.allowances.${index}.detail`);
  
        const itemTotal = calculateTotal(allowance, details);
        return totalSum + itemTotal;
      }, 0);
  
      const alldestinations = form.getValues('destinations');
  
      const totalAll = alldestinations.reduce(
        (destinationSum: number, destination: any, destinationIndex: number) => {
          const allowances = destination.allowances || [];
  
          const allowanceTotal = allowances.reduce(
            (allowanceSum: number, allowance: any, index: number) => {
              const details = form.getValues(
                `destinations.${destinationIndex}.allowances.${index}.detail`,
              );
  
              const itemTotal = calculateTotal(allowance, details);
              return allowanceSum + itemTotal;
            },
            0,
          );
  
          return destinationSum + allowanceTotal;
        },
        0,
      );
  
      setGrandTotal(newTotal);
      setTotalAllowance(totalAll);
    }, [allowanceField, form.watch()]); // Menggunakan form.watch() agar memantau perubahan input
    // Fungsi untuk menghitung total per allowance
    const calculateTotal = (allowance: any, details: any) => {
      if (allowance.type === 'total') {
        const basePrice = parseFloat(details?.[0]?.request_price || 0);
        return basePrice;
      } else {
        return details?.reduce(
          (sum: number, item: any) => sum + parseFloat(item.request_price || 0),
          0,
        );
      }
    };
  
    return (
      <>
        <table className='w-full text-sm mt-10'>
          <thead>
            <tr>
              <th className='w-[50%]'>Item</th>
              <th className='w-[50%]'>Sub Total</th>
            </tr>
          </thead>
          <tbody>
            {allowanceField.map((allowance: any, index: number) => (
              <ResultPerItem
                allowance={allowance}
                destinationIndex={destinationIndex}
                form={form}
                allowanceIndex={index}
              />
            ))}
          </tbody>
          <tfoot className='mt-4'>
            <tr className='font-bold'>
              <td>
                <i>Total Allowance</i>
              </td>
              <td className='flex justify-between pr-4'>
                <span>
                  <i>IDR</i>
                </span>
                <span>
                  <i>{formatRupiah(grandTotal)}</i>
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </>
    );
  }

  export function ResultPerItem({
    allowance,
    destinationIndex,
    form,
    allowanceIndex,
  }: {
    allowance: any;
    destinationIndex: number;
    form: any;
    allowanceIndex: number;
  }) {
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
  
    return (
      <tr key={allowance.id}>
        <td>{allowance.name}</td>
        <td className='flex justify-between pr-4'>
          <span>IDR</span>
          <span>{formatRupiah(calculateTotal())}</span>
        </td>
      </tr>
    );
  }