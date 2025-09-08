import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/AllowanceModel';
import { GET_MASTER_ASSET } from '@/endpoint/masterAsset/api';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { AllowanceForm } from './components/AllowaceForm';
import {
  CREATE_API_ALLOWANCE_CATEGORY,
  DELETE_ALLOWANCE_CATEGORY,
  GET_DETAIL_ALLOWANCE_CATEGORY,
  GET_LIST_ALLOWANCE_CATEGORY,
  UPDATE_ALLOWANCE_CATEGORY,
} from '@/endpoint/allowance-category/api';
import { FormType } from '@/lib/utils';

const roleAkses = 'master business trip allowance category';

export const Index = () => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  const [allowanceForm, setAllowanceForm] = React.useState({
    type: FormType.create,
    id: null,
  });

  function openFormHandler() {
    console.log('allowance form', allowanceForm);
    setAllowanceForm({
      type: FormType.create,
      id: null,
    });

    setOpenForm(!openForm);
  }
  return (
    <>
      <div className='flex md:mb-4 mb-2 w-full justify-end'>
        <CustomDialog onClose={() => setOpenForm(false)} open={openForm}>
          <AllowanceForm
            type={allowanceForm.type}
            id={allowanceForm.id}
            detailUrl={GET_DETAIL_ALLOWANCE_CATEGORY(allowanceForm.id)}
            updateUrl={UPDATE_ALLOWANCE_CATEGORY(allowanceForm.id)}
            createUrl={CREATE_API_ALLOWANCE_CATEGORY}
            onSuccess={(value) => {
              setOpenForm(false);
            }}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        role={{
          detail: `${roleAkses} view`,
          create: `${roleAkses} create`,
          update: `${roleAkses} update`,
          delete: `${roleAkses} delete`,
        }}
        columns={columns}
        actionType='dropdown'
        onEdit={(value) => {
          setAllowanceForm({
            type: FormType.edit,
            id: value,
          });
          setOpenForm(true);
        }}
        onCreate={openFormHandler}
        url={{
          url: GET_LIST_ALLOWANCE_CATEGORY,
          deleteUrl: DELETE_ALLOWANCE_CATEGORY,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Allowance Category' description='Allowance Category'>
    {page}
  </MainLayout>
);

export default Index;
