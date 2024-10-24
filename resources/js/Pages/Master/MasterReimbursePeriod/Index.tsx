import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns } from './models/models';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { GET_LIST_REIMBURSE_PERIOD } from '@/endpoint/reimbursePeriod/api';
import ReimbursePeriodForm from './component/form';

export const Index = () => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  function openFormHandler() {
    setOpenForm(!openForm);
  }
  return (
    <>
      <div className='flex md:mb-4 mb-2 w-full justify-end'>
        <Button onClick={openFormHandler}>
          <PlusIcon />
        </Button>

        <CustomDialog
          onClose={() => setOpenForm(false)}
          open={openForm}
          onOpenChange={openFormHandler}
        >
          <ReimbursePeriodForm />
        </CustomDialog>
      </div>
      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        url={{
          url: GET_LIST_REIMBURSE_PERIOD,
        }}
        labelFilter='search'
      />
    </>
  );
};

Index.layout = (page: ReactNode) => (
  <MainLayout title='Reimburse Period' description='Reimburse Period'>
    {page}
  </MainLayout>
);

export default Index;
