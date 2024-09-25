import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/shacdn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shacdn/dropdown-menu';
import { Plus as PlusIcon } from 'lucide-react';
import { CustomTable } from '@/components/commons/CustomTable';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { HeaderPage } from '@/components/commons/HeaderPage';
import { ReimburseForm } from './components/ReimburseForm';
import './css/reimburse.scss';

interface Reimburse {
  id: string;
  rn: string;
  currency: string;
  requester: string;
  remark: string;
  balance: string;
  users: User;
  receipt_date: string;
}

interface User {
  nip: string;
  name: string;
}

interface Type {
  code: string;
  name: string;
}

interface Currency {
  code: string;
  name: string;
}

interface Props {
  reimburses: Reimburse[];
  users: User[];
  types: Type[];
  currencies: Currency[];
  csrf_token: string;
}

const ListReimburse: React.FC<Props> = ({ reimburses, users, types, currencies, csrf_token }) => {
  const [open, setOpen] = useState(false);
  const [currentReimbursement, setCurrentReimbursement] = useState<Reimburse | null>(null);

  const handleOpenForm = (reimbursement: Reimburse | null = null) => {
    setCurrentReimbursement(reimbursement);
    setOpen(true);
  };

  const handleCloseForm = () => {
    setCurrentReimbursement(null);
    setOpen(false);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const columns: ColumnDef<Reimburse>[] = [
    {
      accessorKey: 'rn',
      header: 'Request Number',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('rn')}</div>,
    },
    {
      accessorKey: 'users.name',
      header: 'Request For',
      cell: ({ row }) => <div className='lowercase'>{row.original.users.name}</div>,
    },
    {
      accessorKey: 'balance',
      header: 'Balance',
      cell: ({ row }) => (
        <div>
          {row.original.currency}
          {'. '}
          {numberWithCommas(row.getValue('balance'))}
        </div>
      ),
    },
    {
      accessorKey: 'remark',
      header: 'Remarks',
      cell: ({ row }) => <div>{row.getValue('remark')}</div>,
    },
    {
      accessorKey: 'receipt_date',
      header: 'Receipt Date',
      cell: ({ row }) => <div>{row.getValue('receipt_date')}</div>,
    },
    {
      accessorKey: 'request_status',
      header: () => <div className='text-left'>Request Status</div>,
      cell: ({ row }) => <div>{row.getValue('request_status') ?? '-'}</div>,
    },

    {
      accessorKey: 'paid_status',
      header: () => <div className='text-left'>Paid Status</div>,
      cell: ({ row }) => <div>{row.getValue('paid_status') ?? '-'}</div>,
    },

    {
      accessorKey: 'source',
      header: () => <div className='text-left'>Source</div>,
      cell: ({ row }) => <div>{row.getValue('request_status') ?? '-'}</div>,
    },
    {
      accessorKey: 'id',
      id: 'actions',
      enableHiding: false,
      header: 'Action',
      cell: ({ row }) => {
        const reimbursement = row.original;

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
        <CustomDialog className='md:max-w-[800px]' open={open} onClose={handleCloseForm}>
          <ReimburseForm
            users={users}
            types={types}
            currencies={currencies}
            csrf_token={csrf_token}
          />
        </CustomDialog>
        <div className='flex items-center justify-between'>
          <HeaderPage title='Reimburse' />
          <div className='flex items-center space-x-4'>
            <Button variant={'outline'} onClick={() => handleOpenForm()}>
              <PlusIcon className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <CustomTable columns={columns} data={reimburses} />
      </div>
    </AuthenticatedLayout>
  );
};

export default ListReimburse;
