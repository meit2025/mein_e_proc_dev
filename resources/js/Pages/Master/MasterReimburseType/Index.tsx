import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns } from './models/models';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { Grade, MaterialGroupModel } from './models/models';
import { MaterialModel } from '../MasterMaterial/model/listModel';
import ReimburseTypeForm from './component/form';
import { FormType } from '@/lib/utils';
import { LIST_API_REIMBURSE_TYPE, EDIT_REIMBURSE_TYPE, UPDATE_REIMBURSE_TYPE, DELETE_REIMBURSE_TYPE } from '@/endpoint/reimburseType/api';

interface propsType {
  listGrades?: Grade[];
  listMaterialNumber?: MaterialModel[];
  listMaterialGroup?: MaterialGroupModel[];
}

export const Index = ({ listGrades, listMaterialNumber, listMaterialGroup }: propsType) => {
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
          <ReimburseTypeForm
            type={formType.type}
            listGrades={listGrades}
            listMaterialNumber={listMaterialNumber}
            listMaterialGroup={listMaterialGroup}
            editURL={EDIT_REIMBURSE_TYPE(formType.id ?? '')}
            updateURL={UPDATE_REIMBURSE_TYPE(formType.id ?? '')}
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
          url: LIST_API_REIMBURSE_TYPE,
          deleteUrl: DELETE_REIMBURSE_TYPE
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
