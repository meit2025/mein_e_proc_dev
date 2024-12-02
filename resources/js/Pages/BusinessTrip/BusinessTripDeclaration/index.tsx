import DataGridComponent from '@/components/commons/DataGrid';
import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';

import { CustomDialog } from '@/components/commons/CustomDialog';
import { BusinessTripType, columns, UserModel } from './models/models';

import {
  DELET_API,
  GET_LIST_BUSINESS_TRIP_DECLARATION,
} from '@/endpoint/business-trip-declaration/api';
import { DETAIL_PAGE_BUSINESS_TRIP_DECLARATION } from '@/endpoint/business-trip-declaration/page';
import { PurposeTypeModel } from '../PurposeType/models/models';
import { BussinessTripFormV1 } from './components/BussinessTripFormV1';

interface propsType {
  listPurposeType: PurposeTypeModel[];
  users: UserModel[];
  listBusinessTrip: any;
}
const roleAkses = 'business trip declaration';
export const Index = ({ listPurposeType, users, listBusinessTrip }: propsType) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  const [businessTripForm, setBusinessTripForm] = React.useState({
    type: BusinessTripType.create,
    id: undefined,
  });

  function openFormHandler() {
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
          <BussinessTripFormV1
            users={users}
            listPurposeType={listPurposeType}
            listBusinessTrip={listBusinessTrip}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        isHistory={true}
        role={{
          detail: `${roleAkses} view`,
          create: `${roleAkses} create`,
          update: `${roleAkses} update`,
          delete: `${roleAkses} delete`,
        }}
        onCreate={openFormHandler}
        columns={columns}
        actionType='dropdown'
        onEdit={(value) => {
          setBusinessTripForm({
            type: BusinessTripType.edit,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        url={{
          url: GET_LIST_BUSINESS_TRIP_DECLARATION,
          deleteUrl: DELET_API,
          detailUrl: DETAIL_PAGE_BUSINESS_TRIP_DECLARATION,
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
