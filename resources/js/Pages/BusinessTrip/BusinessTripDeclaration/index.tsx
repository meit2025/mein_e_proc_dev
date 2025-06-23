import { BusinessTripType, UserModel, columns } from './models/models';
import React, { ReactNode } from 'react';

import { BussinessTripFormV1 } from './components/BussinessTripFormV1';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { DETAIL_PAGE_BUSINESS_TRIP_DECLARATION, PRINT_PAGE_BUSINESS_TRIP_DECLARATION } from '@/endpoint/business-trip-declaration/page';
import DataGridComponent from '@/components/commons/DataGrid';
import { GET_LIST_BUSINESS_TRIP_DECLARATION } from '@/endpoint/business-trip-declaration/api';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { PurposeTypeModel } from '../PurposeType/models/models';

interface propsType {
  listPurposeType: PurposeTypeModel[];
  users: UserModel[];
  listBusinessTrip: any;
}
const roleAkses = 'business trip declaration';
export const Index = ({ listPurposeType, users, listBusinessTrip }: propsType) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  const [businessTripForm, setBusinessTripForm] = React.useState<{
    type: BusinessTripType;
    id: string | undefined;
  }>({
    type: BusinessTripType.create,
    id: undefined,
  });

  function openFormHandler() {
    setBusinessTripForm({
      type: BusinessTripType.create,
      id: undefined,
    });
    setOpenForm(!openForm);
  }
  return (
    <>
      <div className='flex justify-end w-full mb-2 md:mb-4'>
        {/* <Button onClick={openFormHandler}>
          <PlusIcon />
        </Button> */}

        <CustomDialog
          onClose={() => setOpenForm(false)}
          open={openForm}
          onOpenChange={openFormHandler}
          className='md:max-w-[879px]'
        >
          <BussinessTripFormV1 type={businessTripForm.type} id={businessTripForm.id} />
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
        // isClone={true}
        // onEdit={(value) => {
        //   setBusinessTripForm({
        //     type: BusinessTripType.edit,
        //     id: value.toString(),
        //   });
        //   setOpenForm(true);
        // }}
        onClone={(value) => {
          setBusinessTripForm({
            type: BusinessTripType.clone,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        url={{
          url: GET_LIST_BUSINESS_TRIP_DECLARATION,
          detailUrl: DETAIL_PAGE_BUSINESS_TRIP_DECLARATION,
          printUrl: PRINT_PAGE_BUSINESS_TRIP_DECLARATION,
          cancelApproval: 'trip_declaration',
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
