import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/shacdn/button';
import { Calendar } from '@/components/shacdn/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shacdn/popover';

interface CustomDatePickerProps {
  className?: string;
  dateFormat?: string;
  initialDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function CustomDatePicker({
  className = 'w-[150px]',
  dateFormat = 'dd/MM/yyyy',
  //   dateFormat = 'M/d/yyyy',
  initialDate,
  disabled = false,
  onDateChange,
}: CustomDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!disabled) {
      setDate(selectedDate);
      if (onDateChange) {
        onDateChange(selectedDate);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal text-xs',
            !date && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, dateFormat) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar mode='single' selected={date} onSelect={handleDateChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
