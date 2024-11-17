import { useState, useEffect } from 'react';
import { Button } from '@/components/shacdn/button';
import { Inertia } from '@inertiajs/inertia';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/shacdn/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/shacdn/textarea';
import '../css/reimburse.scss';
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
import axios, { AxiosError } from 'axios';
import { CustomDatePicker } from '@/components/commons/CustomDatePicker';
import { Input } from '@/components/shacdn/input';
import { useAlert } from '../../../contexts/AlertContext.jsx';
import { usePage } from '@inertiajs/react';

export const ReimburseForm2 = ({}) => {
  return (
    <ScrollArea className='h-[600px] w-full'>
      <Form>
        <form>
          <table className='text-xs mt-4 reimburse-form-table font-thin'>
            <tbody>
              <tr>
                <td width={200}>Reimburse Request No.</td>
                <td></td>
              </tr>
              <tr>
                <td width={200}>Request Status</td>
                <td>-</td>
              </tr>
              <tr>
                <td width={200}>Remark</td>
                <td>
                </td>
              </tr>
            </tbody>
          </table>

          <Separator className='my-4' />

          <Separator className='my-4' />
          <div className='mt-4 flex justify-end'>
            <Button type='submit' className='w-32'>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};
