import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { usePage } from '@inertiajs/react';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { columns, FamilyModel, UserModel } from './models/models';
import { FamilyHeaderForm } from './components/form';
import { GET_LIST_FAMILY } from '@/endpoint/family/api';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { FormType } from '@/lib/utils';

interface propsType {
  user: UserModel[];
}

export const Index = ({ user }: propsType) => {
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
          <FamilyHeaderForm user={user} />
        </CustomDialog>
      </div>
      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        url={{
          url: GET_LIST_FAMILY,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Family' description='Family Members'>
    {page}
  </MainLayout>
);

export default Index;
