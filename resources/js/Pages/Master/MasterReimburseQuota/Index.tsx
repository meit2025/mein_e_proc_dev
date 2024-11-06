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
import { FormType } from '@/lib/utils';
import { ListPeriodModel } from '../MasterReimbursePeriod/models/models';
import { ReimburseTypeModel } from '../MasterReimburseType/models/models';
import { STORE_REIMBURSE_QUOTA, EDIT_REIMBURSE_QUOTA, UPDATE_REIMBURSE_QUOTA } from '@/endpoint/reimburseQuota/api';

interface propsType {
  listPeriodReimburse: ListPeriodModel[];
  listReimburseType: ReimburseTypeModel[];
  listUser: User[];
}

export const Index = ({ listPeriodReimburse, listReimburseType, listUser }: propsType) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  const [formType, setFormType] = React.useState({
    type: FormType.create,
    id: undefined,
  });

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
            type={formType.type}
            listUser={listUser}
            storeURL={STORE_REIMBURSE_QUOTA}
            editURL={EDIT_REIMBURSE_QUOTA(formType.id ?? '')}
            updateURL={UPDATE_REIMBURSE_QUOTA(formType.id ?? '')}
            listPeriodReimburse={listPeriodReimburse}
            listReimburseType={listReimburseType}
            onSuccess={(value) => {
              setOpenForm(false);
            }}
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
          url: LIST_API_REIMBURSE_QUOTA,
          deleteUrl: LIST_API_REIMBURSE_QUOTA,
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
