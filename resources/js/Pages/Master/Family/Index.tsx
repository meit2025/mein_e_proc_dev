import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { usePage } from '@inertiajs/react';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { columns, FamilyModel, UserModel } from './models/models';
import { FamilyHeaderForm } from './components/form';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { FormType } from '@/lib/utils';
import { LIST_API_FAMILY, CREATE_API_FAMILY, EDIT_FAMILY, UPDATE_FAMILY } from '@/endpoint/family/api';

interface propsType {
  user: UserModel[];
}

export const Index = ({ user }: propsType) => {
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
          <FamilyHeaderForm
            type={formType.type}
            user={user}
            storeURL={CREATE_API_FAMILY}
            editURL={EDIT_FAMILY(formType.id ?? '')}
            updateURL={UPDATE_FAMILY(formType.id ?? '')}
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
          url: LIST_API_FAMILY,
        }}
        labelFilter='search'
      />
    </>
  );
};

Index.layout = (page: ReactNode) => (
  <MainLayout title='Family' description='Family Members'>
    {page}
  </MainLayout>
);

export default Index;
