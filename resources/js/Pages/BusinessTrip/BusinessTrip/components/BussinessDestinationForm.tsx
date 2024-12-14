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
import { DetailAttedances } from './DetailAttedances';
import { DetailAllowance } from './DetailAllowance';
import { ResultTotalItem } from './ResultTotalItem';

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

export function BussinessDestinationForm({
  form,
  index,
  destination,
  updateDestination,
  listAllowances,
  setTotalAllowance,
  listDestination,
  pajak,
  purchasingGroup,
  dataTax,
  dataPurchasingGroup,
  dataDestination,
}: {
  form: any;
  index: number;
  destination: any;
  updateDestination: any;
  listAllowances: any;
  setTotalAllowance: any;
  listDestination: DestinationModel[];
  pajak: Pajak[];
  purchasingGroup: PurchasingGroup[];
  dataTax: any;
  dataPurchasingGroup: any;
  dataDestination: any;
}) {
  const {
    fields: detailAttedanceFields,
    update: updateDetailAttedances,
    append: detailAttedanceAppend,
    remove: removeAttendace,
  } = useFieldArray({
    control: form.control,
    name: `destinations.${index}.detail_attedances`,
  });

  const {
    fields: allowancesField,
    update: updateAllowance,
    append: appendAllowance,
    remove: removeAllowance,
    replace: replaceAllowance,
  } = useFieldArray({
    control: form.control,
    name: `destinations.${index}.allowances`,
  });

  //generate detail

  function detailAttedancesGenerate() {
    let momentStart = moment(destination.business_trip_start_date).startOf('day');
    const momentEnd = moment(destination.business_trip_end_date).startOf('day');
    removeAttendace();
    removeAllowance();

    while (momentStart.isBefore(momentEnd) || momentStart.isSame(momentEnd)) {
      const object = {
        date: momentStart.toDate(),
        shift_code: 'SHIFTREGULAR',
        shift_start: '08:00',
        shift_end: '17:00',
        end_time: '17:00',
        start_time: '08:00',
      };

      detailAttedanceAppend(object);
      momentStart = momentStart.add(1, 'days');
    }

    function generateDetailAllowanceByDate(price: string): any[] {
      let momentStart = moment(destination.business_trip_start_date).startOf('day');
      const momentEnd = moment(destination.business_trip_end_date).startOf('day');
      const detailAllowance = [];

      while (momentStart.isBefore(momentEnd) || momentStart.isSame(momentEnd)) {
        detailAllowance.push({
          date: momentStart.toDate(),
          request_price: price,
        });
        momentStart = momentStart.add(1, 'days');
      }
      return detailAllowance;
    }

    const allowancesForm = listAllowances.map((item: any) => {
      return {
        name: item.name,
        code: item.code,
        default_price: parseInt(item.grade_price),
        type: item.type,
        subtotal: parseInt(item.grade_price),
        currency: item.currency_id,
        request_value: item.request_value,
        detail:
          item.type.toLowerCase() == 'total'
            ? [
                {
                  date: null,
                  request_price: parseInt(item.grade_price),
                },
              ]
            : generateDetailAllowanceByDate(item.grade_price),
      };
    });
    replaceAllowance(allowancesForm);
  }

  function endDateHandler(value: Date | undefined) {
    updateDestination(index, {
      ...destination,
      business_trip_end_date: value,
    });
  }

  const handleSelect = (value: string) => {
    updateDestination(index, {
      ...destination,
      destination: value,
    });
  };

  //   console.log(listDestination, 'listDestination 123');
  return (
    <TabsContent value={`destination${index + 1}`}>
      <div key={index}>
        <table className='text-xs mt-4 reimburse-form-detail font-thin'>
          <tr>
            <td width={200}>Destination {destination.destination}</td>
            <td>
              <FormAutocomplete<any>
                fieldLabel=''
                options={dataDestination}
                fieldName={`destinations.${index}.destination`}
                isRequired={true}
                disabled={false}
                placeholder={'Select Destination'}
                classNames='mt-2 w-full'
                onChangeOutside={(value) => {
                  updateDestination(index, {
                    ...destination,
                    destination: value,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <td width={200}>Pajak</td>
            <td>
              <FormAutocomplete<any>
                fieldLabel=''
                options={dataTax}
                fieldName={`destinations.${index}.pajak_id`}
                isRequired={true}
                disabled={false}
                placeholder={'Select Pajak'}
                classNames='mt-2 w-full'
                onChangeOutside={(value) => {
                  updateDestination(index, {
                    ...destination,
                    pajak_id: value,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <td width={200}>Purchasing Group</td>
            <td>
              <FormAutocomplete<any>
                fieldLabel=''
                options={dataPurchasingGroup}
                fieldName={`destinations.${index}.purchasing_group_id`}
                isRequired={true}
                disabled={false}
                placeholder={'Select Purchasing Group'}
                classNames='mt-2 w-full'
                onChangeOutside={(value) => {
                    updateDestination(index, {
                      ...destination,
                      purchasing_group_id: value,
                    });
                  }}
              />
            </td>
          </tr>
          <tr>
            <td width={200}>Bussines Trip Date</td>
            <td className='flex space-x-2 items-center'>
              <FormField
                control={form.control}
                name={`destinations.${index}.business_trip_start_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomDatePicker
                        initialDate={destination.business_trip_start_date}
                        onDateChange={(value) => {
                          updateDestination(index, {
                            ...destination,
                            business_trip_start_date: value,
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <span>To</span>
              <FormField
                control={form.control}
                name={`destinations.${index}.business_trip_end_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomDatePicker
                        initialDate={destination.business_trip_end_date}
                        onDateChange={(value) => {
                          updateDestination(index, {
                            ...destination,
                            business_trip_end_date: value,
                          });

                          //   endDateHandler(value);
                        }}
                      />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='button' onClick={() => detailAttedancesGenerate()}>
                Get Detail
              </Button>
            </td>
          </tr>
        </table>

        <DetailAttedances
          detailAttedanceFields={detailAttedanceFields}
          form={form}
          updateAttedanceFields={updateDetailAttedances}
          destinationIndex={index}
        />
        <table className='text-xs mt-4 reimburse-form-detail font-thin'>
          <tr>
            <td className='text-sm'>Detail Bussines Trip Allowance:</td>
            <td></td>
          </tr>
        </table>
        <DetailAllowance allowanceField={allowancesField} destinationIndex={index} form={form} />
      </div>

      <ResultTotalItem
        allowanceField={allowancesField}
        destinationIndex={index}
        form={form}
        setTotalAllowance={setTotalAllowance}
      />
    </TabsContent>
  );
}
