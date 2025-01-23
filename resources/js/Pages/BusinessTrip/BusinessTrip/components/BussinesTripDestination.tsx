import '../css/index.scss';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';
import * as React from 'react';
import { AllowanceItemModel, Pajak, PurchasingGroup } from '../models/models';
import { BussinessDestinationForm } from './BussinessDestinationForm';
import { GET_DATE_BUSINESS_TRIP_BY_USER } from '@/endpoint/business-trip/api';
import axiosInstance from '@/axiosInstance';

interface DateObject {
    from: string;
    to: string;
  }

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
  dateBusinessTripByUser,
  selectedDates,
  setSelectedDates,
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
  dateBusinessTripByUser: DateObject[];
  selectedDates: any;
  setSelectedDates: any;
}) {

      React.useEffect(() => {
        const fetchAndSetDates = async () => {
          try {
            const dates = dateBusinessTripByUser;
            // // Update state dengan data dari API
            setSelectedDates((prev: any) => {
                const updated = [...prev];

                Object.entries(dates).forEach(([key, value]: [any, DateObject]) => {
                    updated[key] = {
                        ...updated[key], // Tetap pertahankan data lainnya jika ada
                        from: new Date(value.from), // Konversi string tanggal ke objek Date
                        to: new Date(value.to),   // Konversi string tanggal ke objek Date
                    };
                  });

              return updated;
            });
          } catch (error) {
            console.error("Failed to fetch dates:", error);
          }
        };

        fetchAndSetDates();
      }, [dateBusinessTripByUser]);


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
