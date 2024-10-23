import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns, ReimburseType } from './model/listModel';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { DELETE_REIMBURSE, EDIT_REIMBURSE, GET_REIMBURSE } from '@/endpoint/reimburse/api';
import { ReimburseForm2 } from './components/ReimburseForm2';
import { Group, Period, Reimburse, User, Currency } from './model/listModel';

interface propsType {
  reimbursement: Group[];
  reimburses: Reimburse[];
  currencies: Currency[];
  periods: Period[];
  types: string[];
  users: User[];
}

export const Index = ({
  currencies,
  types,
  periods,
  reimbursement,
  users,
  reimburses,
}: propsType) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpenForm = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className='flex md:mb-4 mb-2 w-full justify-end'>
        <Button onClick={handleOpenForm}>
          <PlusIcon />
        </Button>

        <CustomDialog onClose={() => setOpen(false)} open={open} onOpenChange={handleOpenForm}>
          <ReimburseForm2
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        url={{
          url: GET_REIMBURSE,
          editUrl: EDIT_REIMBURSE,
          deleteUrl: DELETE_REIMBURSE,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Reimburse' description='Reimburse'>
    {page}
  </MainLayout>
);

export default Index;
