import { cn } from '@/lib/utils';
import { Button } from '@/components/shacdn/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shacdn/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shacdn/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

import * as React from 'react';
import axiosInstance from '@/axiosInstance';
import { AxiosError } from 'axios';
import { LoadingSpin } from './LoadingSpin';

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

export interface AsyncDropdownType {
  url: string;
  filter?: string[];
  id: string;
  placeholder?: string;
  label: string;
  value: string;
  onSelectChange: (value: any) => void;
}
export function AsyncDropdownComponent({
  url,
  filter,
  id,
  label,
  value,
  onSelectChange,
  placeholder = 'Search items ...',
}: AsyncDropdownType) {
  const [open, setOpen] = React.useState(false);
  //   const [value, setValue] = React.useState('');

  const [dropdownList, setDropdownList] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);

  const [searchText, setSearchText] = React.useState('');

  let delay;

  async function getListDropdownFromAPI(event: any) {
    setSearchText(event.target.value);
  }

  async function callAPI() {
    const params = {
      filter: filter,
      search: searchText,
    };

    setIsLoading(true);
    try {
      let response = await axiosInstance.get(url, {
        params: params,
      });

      setIsLoading(false);

      setDropdownList(response.data.data);
    } catch (e) {
      const error = e as AxiosError;

      console.log(error);
    }
  }
  function onKeyDownHandler(e) {
    if (e.key === 'Enter') {
      clearTimeout(delay);
      callAPI();
      console.log('keyDown press and ready for api call');
    }
  }

  React.useEffect(() => {
    delay = setTimeout(() => {
      if (searchText) callAPI();
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  function onSelectHandler(currentValue: any) {
    onSelectChange(currentValue);
    setOpen(false);
  }

  console.log(url);

  React.useEffect(() => {
    if (open) {
      callAPI();
    } else {
      setSearchText('');
    }
  }, [open]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] text-xs justify-between'
        >
          {value
            ? dropdownList.find((framework) => String(framework[id]) === String(value))?.[label]
            : placeholder}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command shouldFilter={false}>
          <CommandInput
            onKeyDown={onKeyDownHandler}
            onValueChange={(value) => setSearchText(value)}
            placeholder={placeholder}
          />
          <CommandList className='z-30'>
            {isLoading ? (
              <div className='py-10'>
                <LoadingSpin />
              </div>
            ) : (
              <>
                <CommandEmpty>No framework found. {dropdownList.length}</CommandEmpty>

                {dropdownList.length > 0 ? (
                  <CommandGroup className='z-30'>
                    {dropdownList.map((framework) => (
                      <CommandItem
                        className='z-30'
                        key={framework[id]}
                        value={framework[id]}
                        onSelect={(currentValue) => {
                          onSelectHandler(framework[id]);
                        }}
                      >
                        {framework[label]}

                        <Check
                          className={cn(
                            'ml-auto',
                            value === framework[id] ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
