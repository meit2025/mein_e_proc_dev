import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns, UserModel } from './models/models';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { GET_LIST_ALLOWANCE_ITEM } from '@/endpoint/allowance-item/api';
import { AllowanceCategoryModel } from '../AllowanceCategory/model/AllowanceModel';

import {
  BussinessTripFormV1
} from './components/BussinessTripFormV1';
import { PurposeTypeModel } from '../PurposeType/models/models';
import {BusinessTripModel} from '../BusinessTrip/models/models'

interface propsType {
  listPurposeType: PurposeTypeModel[],
  users: UserModel[],
  listBusinessTrip: any,
}
export const Index = ({ listPurposeType, users, listBusinessTrip }: propsType) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);
    console.log('bisnis ' + listBusinessTrip)
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
          <BussinessTripFormV1 users={users} listPurposeType={listPurposeType} listBusinessTrip={listBusinessTrip}/>
        </CustomDialog>
      </div>
      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        url={{
          url: GET_LIST_ALLOWANCE_ITEM,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Business Trip Declaration' description='Business Trip Declaration'>
    {page}
  </MainLayout>
);

export default Index;
