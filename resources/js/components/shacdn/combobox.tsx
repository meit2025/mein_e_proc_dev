'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shacdn/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shacdn/popover';
import { Button } from './button';

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];

interface listData {
    value: string; // ID atau unique key
    label: string; // Nama atau label yang ditampilkan
}
  
  interface ComboboxProps {
    data: listData[];
    onSelect?: (selectedValue: string) => void; // Callback saat dipilih
    values?: string;
  }

export function Combobox({ data, onSelect, values: initialValue }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue;
    setValue(newValue);
    onSelect?.(newValue); // Kirim nilai ke parent jika ada
    setOpen(false);
  };

  // Update state value saat prop value berubah
  React.useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {value
            ? data.find((datax) => datax.value === value)?.label
            : 'Select option...'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search option...' className='h-9' />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {data.map((datax) => (
                <CommandItem
                  key={datax.value}
                  value={datax.value}
                  onSelect={() => handleSelect(datax.value)}
                >
                  {datax.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === datax.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
