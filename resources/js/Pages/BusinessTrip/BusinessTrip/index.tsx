import { CustomDialog } from '@/components/commons/CustomDialog';
import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_API_BUSINESS_TRIP, GET_LIST_BUSINESS_TRIP } from '@/endpoint/business-trip/api';
import {
  CLONE_PAGE_BUSINESS_TRIP,
  DETAIL_PAGE_BUSINESS_TRIP,
  EDIT_PAGE_BUSINESS_TRIP,
} from '@/endpoint/business-trip/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { Link, usePage } from '@inertiajs/react';
import React, { ReactNode } from 'react';
import { DestinationModel } from '../Destination/models/models';
import { PurposeTypeModel } from '../PurposeType/models/models';
import { BussinessTripFormV1 } from './components/BussinessTripFormV1';
import {
  BusinessTripType,
  columns,
  Costcenter,
  Pajak,
  PurchasingGroup,
  UserModel,
} from './models/models';
interface propsType {
  listPurposeType: PurposeTypeModel[];
  users: UserModel[];
  pajak: Pajak[];
  costcenter: Costcenter[];
  purchasingGroup: PurchasingGroup[];
}

interface UserAuth {
  id: number;
  name: string;
  email: string;
  role: string;
  role_id: string;
  is_admin: string;
}

interface SharedProps {
  auth: {
    user: UserAuth | null;
  };
}

const roleAkses = 'business trip request';

export const Index = ({
  listPurposeType,
  users,
  pajak,
  costcenter,
  purchasingGroup,
}: propsType) => {
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

  const { auth } = usePage().props as unknown as SharedProps;

  // Get the logged-in user's ID
  const userId = auth.user?.id;
  const isAdmin = auth.user?.is_admin;

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
            idUser={userId}
            isAdmin={isAdmin}
            listPurposeType={listPurposeType}
            pajak={pajak}
            costcenter={costcenter}
            purchasingGroup={purchasingGroup}
            type={businessTripForm.type}
            id={businessTripForm.id}
            successSubmit={(x: boolean) => {
              if (x) window.location.reload();
            }}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        isHistory={true}
        isClone={true}
        role={{
          detail: `${roleAkses} view`,
          create: `${roleAkses} create`,
          update: `${roleAkses} update`,
          delete: `${roleAkses} delete`,
        }}
        onCreate={openFormHandler}
        columns={columns}
        onClone={(value) => {
          setBusinessTripForm({
            type: BusinessTripType.clone,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        url={{
          url: GET_LIST_BUSINESS_TRIP,
          detailUrl: DETAIL_PAGE_BUSINESS_TRIP,
          cancelApproval: 'trip',
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
