import '../css/index.scss';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';
import { useAlert } from '@/contexts/AlertContext';
import * as React from 'react';
import { AllowanceItemModel, Pajak, PurchasingGroup } from '../models/models';
import { BussinessDestinationForm } from './BussinessDestinationForm';

export function BussinesTripDestination({
  updateDestination,
  destinationField,
  form,
  listAllowances,
  totalDestination,
  pajak,
  purchasingGroup,
  setTotalAllowance,
  dataTax,
  dataPurchasingGroup,
  dataDestination,
  type,
  btClone,
}: {
  updateDestination: any;
  destinationField: any;
  form: any;
  listAllowances: AllowanceItemModel[];
  totalDestination: string;
  pajak: Pajak[];
  purchasingGroup: PurchasingGroup[];
  setTotalAllowance: any;
  dataTax: any;
  dataPurchasingGroup: any;
  dataDestination: any;
  type: any;
  btClone: any;
}) {
  const [selectedDates, setSelectedDates] = React.useState<
    { start: Date | undefined; end: Date | undefined }[]
  >([]);
  return (
    <Tabs defaultValue='destination1' className='w-full'>
      <TabsList className={'flex items-center justify-start space-x-4'}>
        {destinationField.map((field: any, index: number) => (
          <TabsTrigger key={`trigger-${index}`} value={`destination${index + 1}`}>Destination {index + 1}</TabsTrigger>
        ))}
      </TabsList>

      {destinationField.map((destination: any, index: number) => (
        <BussinessDestinationForm
          key={`destination-form-${index}`}
          form={form}
          index={index}
          destination={destination}
          updateDestination={updateDestination}
          listAllowances={listAllowances}
          setTotalAllowance={setTotalAllowance}
          pajak={pajak}
          purchasingGroup={purchasingGroup}
          dataTax={dataTax}
          dataPurchasingGroup={dataPurchasingGroup}
          dataDestination={dataDestination}
          type={type}
          btClone={btClone}
          setSelectedDates={setSelectedDates}
          selectedDates={selectedDates}
        />
      ))}
    </Tabs>
  );
}
