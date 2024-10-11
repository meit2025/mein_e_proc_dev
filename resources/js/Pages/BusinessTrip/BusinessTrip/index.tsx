import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns, UserModel } from './models/models';
import { GET_MASTER_ASSET } from '@/endpoint/masterAsset/api';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { GET_LIST_ALLOWANCE_ITEM } from '@/endpoint/allowance-item/api';
import { AllowanceCategoryModel } from '../AllowanceCategory/model/AllowanceModel';
// import AllowanceItemForm from './component/form';

import {
  BussinessTripFormV1
} from './components/BussinessTripFormV1';
import { PurposeTypeModel } from '../PurposeType/models/models';
interface propsType {
  listPurposeType: PurposeTypeModel[],
  users: UserModel[]
}
export const Index = ({ listPurposeType, users }: propsType) => {
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
          <BussinessTripFormV1 users={users} listPurposeType={listPurposeType} />
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
  <MainLayout title='Business Trip' description='Business Trip'>
    {page}
  </MainLayout>
);

export default Index;
