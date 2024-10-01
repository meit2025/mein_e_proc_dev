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
  initialDate?: Date; // Add a prop for the initial date
  onDateChange?: (date: Date | undefined) => void; // Add a prop for when the date changes
}

export function CustomDatePicker({
  className = 'w-[150px]',
  dateFormat = 'M/d/yyyy',
  initialDate,
  onDateChange,
}: CustomDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate); // Call the callback when the date changes
    }
  };

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
        <Calendar mode='single' selected={date} onSelect={handleDateChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
