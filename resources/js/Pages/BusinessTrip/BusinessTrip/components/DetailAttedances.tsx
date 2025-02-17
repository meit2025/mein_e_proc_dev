import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shacdn/form';
import '../css/index.scss';
import { Input } from '@/components/shacdn/input';
import moment from 'moment';
import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shacdn/select';
export function DetailAttedances({
  form,
  destinationIndex,
  detailAttedanceFields,
  updateAttedanceFields,
  type,
  btClone,
}: {
  form: any;
  destinationIndex: number;
  detailAttedanceFields: any;
  updateAttedanceFields: any;
  type: any;
  btClone: any;
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
                  <td style={{verticalAlign: 'middle'}}>
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

                  <td style={{verticalAlign: 'middle'}}>
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.shift_code`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)} // Pass selected value to React Hook Form
                            value={field.value} // Set the current value from React Hook Form
                            >
                            <SelectTrigger className='w-[140px]'>
                                <SelectValue placeholder='Select Shiftcode' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key='REGULERSHIFT' value='REGULERSHIFT'>
                                    REGULERSHIFT
                                </SelectItem>
                                <SelectItem key='DAY-OFF' value='DAY-OFF'>
                                    DAY-OFF
                                </SelectItem>
                            </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td style={{verticalAlign: 'middle'}}>
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
                  <td style={{verticalAlign: 'middle'}}>
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
                  <td style={{verticalAlign: 'middle'}}>
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.start_date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={moment(field.value).format('YYYY-MM-DD')}
                              onChange={field.onChange}
                              type='date'
                              style={{marginBottom: '5px'}}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.start_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                                value={field.value ? moment(field.value, "HH:mm").format("HH:mm") : ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                type="time"
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
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.end_date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={moment(field.value).format('YYYY-MM-DD')}
                              onChange={field.onChange}
                              type='date'
                              style={{marginBottom: '5px'}}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`destinations.${destinationIndex}.detail_attedances.${index}.end_time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={field.value}
                              onChange={field.onChange}
                              type='time'
                            />
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
