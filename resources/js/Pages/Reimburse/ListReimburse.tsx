import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
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
import { CustomTable, CustomTableFilters } from '@/components/commons/CustomTable';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { HeaderPage } from '@/components/commons/HeaderPage';
import { ReimburseForm } from './components/ReimburseForm';
import './css/reimburse.scss';

import MainLayout from '../Layouts/MainLayout';

interface Reimburse {
  id: string;
  rn: string;
  remark: string;
  type: string;
  currency: string;
  balance: number;
  receipt_date: Date;
  start_date: Date;
  end_date: Date;
  period: string;
}

interface User {
  nip: string;
  name: string;
}

interface Group {
  id: string;
  code: string;
  remark: string;
  users: User;
  reimburses: Reimburse[];
}

interface Type {
  code: string;
  name: string;
}

interface Currency {
  code: string;
  name: string;
}

interface Period {
  id: string;
  code: string;
  start: string;
  end: string;
}

interface Props {
  groups: Group[];
  users: User[];
  types: Type[];
  periods: Period[];
  currencies: Currency[];
  csrf_token: string;
}

const ListReimburse: React.FC<Props> = ({
  groups,
  users,
  types,
  currencies,
  periods,
  csrf_token,
}) => {
  const [open, setOpen] = useState(false);
  const [currentReimbursement, setCurrentReimbursement] = useState<Group | null>(null);

  const handleOpenForm = (reimbursement: Group | null = null) => {
    setCurrentReimbursement(reimbursement);
    setOpen(true);
  };

  const listFilters: CustomTableFilters = [
    {
      params: 'User',
      data: users,
      key: 'nip',
      label: 'name',
    },
    {
      params: 'company',
      data: groups,
      key: 'id',
      label: 'remark',
    },
  ];

  const handleCloseForm = () => {
    setCurrentReimbursement(null);
    setOpen(false);
  };

  // Helper function to format numbers with commas
  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const columns: ColumnDef<Group>[] = [
    {
      accessorKey: 'code',
      header: 'Request Number',
      cell: ({ row }) => <div className='capitalize'>{row.getValue('code')}</div>,
    },
    {
      accessorKey: 'users.name',
      header: 'Request For',
      cell: ({ row }) => <div className='lowercase'>{row.original.users.name}</div>,
    },
    {
      accessorKey: 'remark',
      header: 'Remarks',
      cell: ({ row }) => <div>{row.getValue('remark')}</div>,
    },
    {
      accessorKey: 'reimburses',
      header: 'Balance',
      cell: ({ row }) => {
        const reimburses = row.original.reimburses;
        const sumBalance = reimburses.reduce(
          (sum, reimburse) => sum + parseFloat(reimburse.balance),
          0,
        );
        return <div>{`IDR. ${numberWithCommas(sumBalance)}`}</div>;
      },
    },
    {
      accessorKey: 'reimburses',
      header: 'Form',
      cell: ({ row }) => {
        return <div>{row.original.reimburses.length}</div>;
      },
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
      cell: ({ row }) => <div>{row.getValue('source') ?? '-'}</div>,
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
              <DropdownMenuItem onClick={() => handleOpenForm(reimbursement)}>
                Edit
              </DropdownMenuItem>{' '}
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
    <MainLayout title='Reimburse Page' description='Just Reimburse'>
      <div>
        <CustomDialog className='md:max-w-[800px]' open={open} onClose={handleCloseForm}>
          <ReimburseForm
            users={users}
            types={types}
            currencies={currencies}
            periods={periods}
            csrf_token={csrf_token}
            reimbursement={currentReimbursement}
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
        <CustomTable filters={listFilters} columns={columns} data={groups} />
      </div>
    </MainLayout>
  );
};

export default ListReimburse;
