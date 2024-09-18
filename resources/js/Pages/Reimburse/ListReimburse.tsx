// import * as React from 'react';
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import { Button } from '@/components/shacdn/button';
import { Checkbox } from '@/components/shacdn/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shacdn/dropdown-menu';
import { Input } from '@/components/shacdn/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shacdn/table';

import { CustomTable } from '@/components/commons/CustomTable';

import * as React from 'react';

import { CustomDialog } from '@/components/commons/CustomDialog';

import { HeaderPage } from '@/components/commons/HeaderPage';

const data: Reimburse[] = [
  {
    id: 'm5gr84i9',
    request_number: 'string',
    request_for: 'string',
    total_form: 1,
    remarks: 'string',
    request_status: 'string',
    paid_status: 'string',
    source: 'string',
  },
  {
    id: 'm5gr84i9',
    request_number: 'string',
    request_for: 'string',
    total_form: 1,
    remarks: 'string',
    request_status: 'string',
    paid_status: 'string',
    source: 'string',
  },
];

export type Reimburse = {
  id: string;
  request_number: string;
  request_for: string;
  total_form: number;
  remarks: string;
  request_status: string;
  paid_status: string;
  source: string;
};

const ListReimburse = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const columns: ColumnDef<Reimburse>[] = [
    //   {
    //     id: 'select',
    //     header: ({ table }) => (
    //       <Checkbox
    //         checked={
    //           table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
    //         }
    //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //         aria-label='Select all'
    //       />
    //     ),
    //     cell: ({ row }) => (
    //       <Checkbox
    //         checked={row.getIsSelected()}
    //         onCheckedChange={(value) => row.toggleSelected(!!value)}
    //         aria-label='Select row'
    //       />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    //   },
    {
      accessorKey: 'request_number',
      header: 'Request Number',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('request_number')}</div>,
    },
    {
      accessorKey: 'request_for',
      header: 'Request For',

      cell: ({ row }) => <div className='lowercase'>{row.getValue('request_for')}</div>,
    },
    {
      accessorKey: 'total_form',
      header: () => <div className='text-left'>Total Form</div>,
      cell: ({ row }) => <div>{row.getValue('total_form')}</div>,
    },

    {
      accessorKey: 'remarks',
      header: () => <div className='text-left'>remarks</div>,
      cell: ({ row }) => <div>{row.getValue('remarks')}</div>,
    },

    {
      accessorKey: 'request_status',
      header: () => <div className='text-left'>Request Status</div>,
      cell: ({ row }) => <div>{row.getValue('request_status')}</div>,
    },

    {
      accessorKey: 'paid_status',
      header: () => <div className='text-left'>Paid Status</div>,
      cell: ({ row }) => <div>{row.getValue('paid_status')}</div>,
    },

    {
      accessorKey: 'source',
      header: () => <div className='text-left'>Source</div>,
      cell: ({ row }) => <div>{row.getValue('request_status')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Action',
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <DotsHorizontalIcon className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setOpen(true)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <AuthenticatedLayout>
      <div>
        <CustomDialog open={open} onClose={() => setOpen(false)} />
        <HeaderPage title='Reimbuse' />
        <CustomTable columns={columns} data={data}></CustomTable>
      </div>
    </AuthenticatedLayout>
  );
};

export default ListReimburse;
