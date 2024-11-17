import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns } from './models/models';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { GET_LIST_REIMBURSE_PERIOD, DESTROY_REIMBURSE_PERIOD } from '@/endpoint/reimbursePeriod/api';
import { FormType } from '@/lib/utils';
import ReimbursePeriodForm from './component/form';
import { STORE_REIMBURSE_PERIOD, EDIT_REIMBURSE_PERIOD, UPDATE_REIMBURSE_PERIOD } from '@/endpoint/reimbursePeriod/api';

export const Index = () => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  const [formType, setFormType] = React.useState({
    type: FormType.create,
    id: undefined,
  });

  function openFormHandler() {
    setFormType({
      type: FormType.create,
      id: null,
    })
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
          <ReimbursePeriodForm
            type={formType.type}
            storeURL={STORE_REIMBURSE_PERIOD}
            editURL={EDIT_REIMBURSE_PERIOD(formType.id ?? '')}
            updateURL={UPDATE_REIMBURSE_PERIOD(formType.id ?? '')}
            onSuccess={(x: boolean) => setOpenForm(!x)}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        onEdit={(value) => {
          setFormType({
            type: FormType.edit,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        url={{
          url: GET_LIST_REIMBURSE_PERIOD,
          deleteUrl: DESTROY_REIMBURSE_PERIOD
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
