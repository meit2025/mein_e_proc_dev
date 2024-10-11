import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/AllowanceModel';
import { GET_MASTER_ASSET } from '@/endpoint/masterAsset/api';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { AllowanceForm, AllowanceType } from './components/AllowaceForm';
import { GET_LIST_ALLOWANCE_CATEGORY } from '@/endpoint/allowance-category/api';

export const Index = () => {

    const [openForm, setOpenForm] = React.useState<boolean>(false);

    const [allowanceForm, setAllowanceForm] = React.useState({
        type:AllowanceType.create,
        id: undefined
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
        open={openForm} onOpenChange={openFormHandler}>
          <AllowanceForm
            
            type={allowanceForm.type}
            id={allowanceForm.id}
            onSuccess={(value) => {
              if (value) {
                setOpenForm(false);
              }
            }}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        onEdit={(value) => {
            setAllowanceForm({
                type: AllowanceType.edit,
                id: value.toString()
            });
            setOpenForm(true);
        }}
        url={{
          url: GET_LIST_ALLOWANCE_CATEGORY,
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
