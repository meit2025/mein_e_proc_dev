import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { usePage } from '@inertiajs/react';
import { BusinessTripType, columns, UserModel } from './models/models';
import { GET_MASTER_ASSET } from '@/endpoint/masterAsset/api';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { DELET_API, EDIT_API, GET_LIST_BUSINESS_TRIP } from '@/endpoint/business-trip/api';
import { AllowanceCategoryModel } from '../AllowanceCategory/model/AllowanceModel';
import { BussinessTripFormV1 } from './components/BussinessTripFormV1';
import { PurposeTypeModel } from '../PurposeType/models/models';
interface propsType {
  listPurposeType: PurposeTypeModel[];
  users: UserModel[];
}

interface UserAuth {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface SharedProps {
  auth: {
    user: UserAuth | null;
  };
}

export const Index = ({ listPurposeType, users }: propsType) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  const [businessTripForm, setBusinessTripForm] = React.useState({
    type: BusinessTripType.create,
    id: undefined,
  });

  function openFormHandler() {
    setOpenForm(!openForm);
  }

  const { auth } = usePage().props as unknown as SharedProps;

  // Get the logged-in user's ID
  const userId = auth.user?.id;
  const userRole = auth.user?.role;

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
          <BussinessTripFormV1
            users={users}
            idUser={userId}
            role={userRole}
            listPurposeType={listPurposeType}
            type={businessTripForm.type}
            id={businessTripForm.id}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
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
          url: GET_LIST_BUSINESS_TRIP,
          deleteUrl: DELET_API,
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
