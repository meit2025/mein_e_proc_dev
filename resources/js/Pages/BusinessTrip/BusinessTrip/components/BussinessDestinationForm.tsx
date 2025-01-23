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
import { CustomDatePicker } from '@/components/commons/CustomDatePicker';
import moment from 'moment';
import * as React from 'react';
import {
  Pajak,
  PurchasingGroup,
} from '../models/models';
import FormAutocomplete from '@/components/Input/formDropdown';
import { DetailAttedances } from './DetailAttedances';
import { DetailAllowance } from './DetailAllowance';
import { ResultTotalItem } from './ResultTotalItem';
import { DayPickerProps } from 'react-day-picker';
import { Checkbox } from '@/components/shacdn/checkbox';

interface User {
  id: string;
  nip: string;
  name: string;
}

export function BussinessDestinationForm({
    key,
  form,
  index,
  destination,
  updateDestination,
  listAllowances,
  setTotalAllowance,
  pajak,
  purchasingGroup,
  dataTax,
  dataPurchasingGroup,
  dataDestination,
  type,
  btClone,
  setSelectedDates,
  selectedDates,
}: {
  key: any;
  form: any;
  index: number;
  destination: any;
  updateDestination: any;
  listAllowances: any;
  setTotalAllowance: any;
  pajak: Pajak[];
  purchasingGroup: PurchasingGroup[];
  dataTax: any;
  dataPurchasingGroup: any;
  dataDestination: any;
  type: any;
  btClone: any;
  setSelectedDates: any;
  selectedDates: any;
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
    // console.log(allowancesForm, 'allowancesForm');
    replaceAllowance(allowancesForm);
  }

    const handleDateStartChange = (value: Date | undefined, index: number) => {
        setSelectedDates((prev: any) => {
            const updated = [...prev];
            // Jika nilai ada, perbarui elemen target
            updated[index] = {
            ...updated[index],
            from: value,
            };
            return updated;
        });
    };

    const handleDateEndChange = (value: Date | undefined, index: number) => {
        updateDestination(index, {
        ...destination,
        business_trip_end_date: value,
        });
        setSelectedDates((prev: any) => {
            const updated = [...prev];
            // Perbarui hanya elemen yang ditargetkan
            updated[index] = {
                ...updated[index], // Pastikan data sebelumnya tetap ada
                to: value,
            };
        return updated;
        });
    };
    const [selectedDateRemove, setSelectedDateRemove] = React.useState<Date | undefined>();
    const modifiers: DayPickerProps["modifiers"] = {};
    if (selectedDateRemove) {
        modifiers.selected = selectedDateRemove;
    }

    const handleResetClick = (index: number, type: string): void => {
        if (type === 'start') {
            updateDestination(index,{
                ...destination,
                business_trip_start_date: null,
            });

            setSelectedDates((prev: any) => {
                const updated = [...prev];

                // Jika nilai undefined, hapus elemen target
                updated[index] = {
                    ...updated[index],
                    from: undefined,
                };
                return updated;
            });
        }
        if (type === 'end') {
            updateDestination(index,{
                ...destination,
                business_trip_end_date: null,
            });

            setSelectedDates((prev: any) => {
                const updated = [...prev];

                // Jika nilai undefined, hapus elemen target
                updated[index] = {
                    ...updated[index],
                    to: undefined,
                };
                return updated;
            });
        }

        setSelectedDateRemove(undefined);
    }


    let footerStart = (
        <>
            <button type='button' className='btn btn-danger' onClick={() => handleResetClick(index, 'start')}>Reset</button>
        </>
    );

    let footerEnd = (
        <>
            <button type='button' className='btn btn-danger' onClick={() => handleResetClick(index, 'end')}>Reset</button>
        </>
    );

//   console.log(selectedDates, 'selectedDatesxwerewferge');
  return (
    <TabsContent key={key} value={`destination${index + 1}`}>
      <div key={index}>
        <table className='text-xs mt-4 reimburse-form-detail font-thin'>
          <tr>
            <td width={200}>
              Destination<span className='text-red-600'>*</span>
            </td>
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
            <td width={200}>
            </td>
            <td className='flex gap-2'>
            <FormField
                control={form.control}
                name={`destinations.${index}.restricted_area`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                    <Checkbox
                        checked={destination.restricted_area}
                        onCheckedChange={(value) => {
                            updateDestination(index, {
                                ...destination,
                                restricted_area: value,
                            });
                        }}
                    />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            Restricted Area
            </td>
          </tr>
          <tr>
            <td width={200}>
              Pajak<span className='text-red-600'>*</span>
            </td>
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
            <td width={200}>
              Purchasing Group<span className='text-red-600'>*</span>
            </td>
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
            <td width={200}>
              Bussines Trip Date<span className='text-red-600'>*</span>
            </td>
            <td className='flex space-x-2 items-center'>
              <FormField
                control={form.control}
                name={`destinations.${index}.business_trip_start_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomDatePicker
                        initialDate={destination.business_trip_start_date}
                        // onDateChange={(value) => {
                        //   handleDateStartChange(value, index);
                        // }}
                        modifiers={modifiers}
                        onDayClick={(day, modifiers) => {
                            if (modifiers.selected) {
                                handleDateStartChange(undefined, index);
                                setSelectedDateRemove(undefined);
                                updateDestination(index, {
                                    ...destination,
                                    business_trip_start_date: undefined,
                                    business_trip_end_date: undefined,
                                });
                            } else {
                                handleDateStartChange(day, index);
                                setSelectedDateRemove(day);
                                updateDestination(index, {
                                    ...destination,
                                    business_trip_start_date: day,
                                    business_trip_end_date: day,
                                });
                            }
                        }}
                        disabled={false}
                        disabledDays={selectedDates}
                        footer={footerStart}
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
                        // onDateChange={(value) => {
                        //   handleDateEndChange(value, index);
                        // }}
                        modifiers={modifiers}
                        onDayClick={(day, modifiers) => {
                            if (modifiers.selected) {
                                handleDateEndChange(undefined, index);
                                setSelectedDateRemove(undefined);
                                updateDestination(index, {
                                    ...destination,
                                    business_trip_end_date: undefined,
                                });
                            } else {
                                handleDateEndChange(day, index);
                                setSelectedDateRemove(day);
                                updateDestination(index, {
                                    ...destination,
                                    business_trip_end_date: day,
                                });
                            }
                        }}
                        disabled={false}
                        disabledDays={selectedDates}
                        footer={footerEnd}
                      />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='button'
                onClick={() => detailAttedancesGenerate()}
                // className={
                //   type == btEdit
                //     ? form.watch(`destinations.${index}.destination`)
                //       ? 'hidden'
                //       : ''
                //     : ''
                // }
              >
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
          type={type}
          btClone={btClone}
        />
        <table className='text-xs mt-4 reimburse-form-detail font-thin'>
          <tr>
            <td className='text-sm'>Detail Bussines Trip Allowance:</td>
            <td></td>
          </tr>
        </table>
        <DetailAllowance
          allowanceField={allowancesField}
          destinationIndex={index}
          form={form}
          type={type}
          btClone={btClone}
        />
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
