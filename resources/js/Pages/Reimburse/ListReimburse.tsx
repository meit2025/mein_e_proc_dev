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
import { Currency, Group, Period, PurchasingGroup, User, Tax, CostCenter } from './model/listModel';

interface Props {
  groups: Group[];
  users: User[];
  categories: string[];
  periods: Period[];
  currencies: Currency[];
  purchasing_groups: PurchasingGroup[];
  taxes: Tax[];
  cost_center: CostCenter[];
}

const ListReimburse: React.FC<Props> = ({
  purchasing_groups,
  groups,
  users,
  categories,
  currencies,
  taxes,
  cost_center,
  periods,
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
      cell: ({ row }) => <div className='lowercase'>{row?.original?.users?.name}</div>,
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
          (sum, reimburse) => sum + parseFloat(reimburse?.balance),
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
      accessorKey: 'status',
      header: () => <div className='text-left'>Request Status</div>,
      cell: ({ row }) => <div>{row.getValue('status') ?? '-'}</div>,
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
            purchasing_groups={purchasing_groups}
            users={users}
            categories={categories}
            currencies={currencies}
            periods={periods}
            taxes={taxes}
            cost_center={cost_center}
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
