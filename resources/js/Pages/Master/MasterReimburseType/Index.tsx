import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns } from './models/models';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { MaterialModel } from '@/Pages/Master/MasterMaterial/model/listModel';
import ReimburseTypeForm from './component/form';
import { GET_LIST_REIMBURSE_TYPE } from '@/endpoint/reimburseType/api';

interface propsType {
  listMaterial: MaterialModel[];
}

export const Index = ({ listMaterial }: propsType) => {
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
          <ReimburseTypeForm
            listMaterial={listMaterial}
            onSuccess={(x: boolean) => setOpenForm(!x)}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        url={{
          url: GET_LIST_REIMBURSE_TYPE,
        }}
        labelFilter='search'
      />
    </>
  );
};

Index.layout = (page: ReactNode) => (
  <MainLayout title='Reimburse Type' description='Reimburse Type'>
    {page}
  </MainLayout>
);

export default Index;
