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

export function BussinesTripDestination({
  updateDestination,
  destinationField,
  listDestination = [],
  form,
  listAllowances,
  totalDestination,
  pajak,
  purchasingGroup,
  setTotalAllowance,
  dataTax,
  dataPurchasingGroup,
  dataDestination,
}: {
  updateDestination: any;
  destinationField: any;
  listDestination: DestinationModel[];
  form: any;
  listAllowances: AllowanceItemModel[];
  totalDestination: string;
  pajak: Pajak[];
  purchasingGroup: PurchasingGroup[];
  setTotalAllowance: any;
  dataTax: any;
  dataPurchasingGroup: any;
  dataDestination: any;
}) {
  const [startDate, setStartDate] = React.useState<Date>();

  const [endDate, setEndDate] = React.useState<Date>();

  const [selectedDestinationIdex, setDestinationIndex] = React.useState<number>(0);

  const { showToast } = useAlert();

  return (
    <Tabs defaultValue='destination1' className='w-full'>
      <TabsList className={'flex items-center justify-start space-x-4'}>
        {destinationField.map((field: any, index: number) => (
          <TabsTrigger value={`destination${index + 1}`}>Destination {index + 1}</TabsTrigger>
        ))}
      </TabsList>

      {destinationField.map((destination: any, index: number) => (
        <BussinessDestinationForm
          listAllowances={listAllowances}
          updateDestination={updateDestination}
          destination={destination}
          form={form}
          index={index}
          setTotalAllowance={setTotalAllowance}
          listDestination={listDestination}
          pajak={pajak}
          purchasingGroup={purchasingGroup}
          dataTax={dataTax}
          dataPurchasingGroup={dataPurchasingGroup}
          dataDestination={dataDestination}
        />
      ))}
    </Tabs>
  );
}
