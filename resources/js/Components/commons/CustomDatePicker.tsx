import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/shacdn/button';
import { Calendar } from '@/Components/shacdn/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/shacdn/popover';

interface CustomDatePickerProps {
  className?: string;
  dateFormat?: string;
}
export function CustomDatePicker({
  className = 'w-[150px]',
  dateFormat = 'M/d/yyyy',
}: CustomDatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal text-xs',
            !date && 'text-muted-foreground ',
            className,
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, dateFormat) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar mode='single' selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
