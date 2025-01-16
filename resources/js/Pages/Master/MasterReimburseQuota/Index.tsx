import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns } from './models/models';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import ReimburseQuotaForm from './component/form';
import {
  LIST_API_REIMBURSE_QUOTA,
  STORE_REIMBURSE_QUOTA,
  EDIT_REIMBURSE_QUOTA,
  UPDATE_REIMBURSE_QUOTA,
  DESTROY_REIMBURSE_QUOTA,
} from '@/endpoint/reimburseQuota/api';
import { DETAIL_REIMBURSE_QUOTA } from '@/endpoint/reimburseQuota/page';
import { FormType } from '@/lib/utils';

const roleAkses = 'master reimburse quota';
const roleConfig = {
  detail: `${roleAkses} view`,
  create: `${roleAkses} create`,
  update: `${roleAkses} update`,
  delete: `${roleAkses} delete`,
};
export const Index = () => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  const [formType, setFormType] = React.useState({
    type: FormType.create,
    id: undefined,
  });

  function openFormHandler() {
    setOpenForm(!openForm);
    setFormType({
      type: FormType.create,
      id: undefined,
    });
  }

  return (
    <>
      <div className='flex md:mb-4 mb-2 w-full justify-end'>
        {/* <Button onClick={openFormHandler}>
          <PlusIcon />
        </Button> */}

        <CustomDialog
          onClose={() => setOpenForm(false)}
          open={openForm}
          onOpenChange={openFormHandler}
        >
          <ReimburseQuotaForm
            onSuccess={(value) => {
              setOpenForm(false);
            }}
            type={formType.type}
            storeURL={STORE_REIMBURSE_QUOTA}
            editURL={EDIT_REIMBURSE_QUOTA(formType.id ?? '')}
            updateURL={UPDATE_REIMBURSE_QUOTA(formType.id ?? '')}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        role={roleConfig}
        onCreate={openFormHandler}
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
          detailUrl: DETAIL_REIMBURSE_QUOTA,
          deleteUrl: DESTROY_REIMBURSE_QUOTA,
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
