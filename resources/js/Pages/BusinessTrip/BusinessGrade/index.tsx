import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/model';
import { GET_MASTER_ASSET } from '@/endpoint/masterAsset/api';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { GradeForm } from './components/form';
import {
  CREATE_API_BUSINESS_TRIP_GRADE,
  DELETE_API_BUSINESS_GRADE,
  GET_DETAIL_BUSINESS_TRIP_GRADE,
  GET_LIST_BUSINESS_TRIP_GRADE,
  UPDATE_BUSINESS_TRIP_GRADE,
} from '@/endpoint/business-grade/api';
import { FormType } from '@/lib/utils';
import { UserModel } from '../BusinessTrip/models/models';
const roleAkses = 'master business trip grade';

export const Index = ({ listUser }: { listUser: UserModel[] }) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  const [formType, setFormType] = React.useState({
    type: FormType.create,
    id: undefined,
  });

  function openFormHandler() {
    setFormType({
        type: FormType.create,
        id: null,
    });
    setOpenForm(!openForm);
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
          <GradeForm
            listUser={listUser}
            editURL={UPDATE_BUSINESS_TRIP_GRADE(formType.id ?? '')}
            detailUrl={GET_DETAIL_BUSINESS_TRIP_GRADE(formType.id ?? '')}
            createUrl={CREATE_API_BUSINESS_TRIP_GRADE}
            type={formType.type}
            id={formType.id}
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
        onCreate={openFormHandler}
        columns={columns}
        actionType='dropdown'
        deleteConfirmationText='Are you sure delete this business grade?'
        onEdit={(value) => {
          setFormType({
            type: FormType.edit,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        url={{
          url: GET_LIST_BUSINESS_TRIP_GRADE,
          deleteUrl: DELETE_API_BUSINESS_GRADE,
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
