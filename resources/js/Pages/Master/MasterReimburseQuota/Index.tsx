import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns } from './models/models';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { User } from './models/models';
import ReimburseQuotaForm from './component/form'
import { LIST_API_REIMBURSE_QUOTA } from '@/endpoint/reimburseQuota/api';
import { ListPeriodModel } from '../MasterReimbursePeriod/models/models';

interface propsType {
  listPeriodReimburse: ListPeriodModel[];
  listUsers: User[];
}

export const Index = ({ listPeriodReimburse, listUsers }: propsType) => {
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
          <ReimburseQuotaForm
            listUsers={listUsers}
            listPeriodReimburse={listPeriodReimburse}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        url={{
          url: LIST_API_REIMBURSE_QUOTA,
        }}
        labelFilter='search'
      />
    </>
  );
};

Index.layout = (page: ReactNode) => (
  <MainLayout title='Reimburse Quota' description='Reimburse Quota'>
    {page}
  </MainLayout>
);

export default Index;
