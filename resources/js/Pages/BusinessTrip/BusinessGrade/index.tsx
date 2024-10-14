import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/model';
import { GET_MASTER_ASSET } from '@/endpoint/masterAsset/api';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { GradeForm } from './components/form';
import { GET_DETAIL_BUSINESS_TRIP_GRADE, GET_LIST_BUSINESS_TRIP_GRADE } from '@/endpoint/business-grade/api';
import { FormType } from '@/lib/utils';
import { UserModel } from '../BusinessTrip/models/models';

export const Index = ({
  listUser
}: {
listUser: UserModel[]
}) => {
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
          <GradeForm
            listUser={listUser}
            editURL={GET_DETAIL_BUSINESS_TRIP_GRADE(formType.id ?? '')}
            type={formType.type}
            id={formType.id}
            onSuccess={(value) => {
              // if (value) {
              //   setOpenForm(false);
              // }
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
          url: GET_LIST_BUSINESS_TRIP_GRADE,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Business Grade' description='Business Grade'>
    {page}
  </MainLayout>
);

export default Index;
