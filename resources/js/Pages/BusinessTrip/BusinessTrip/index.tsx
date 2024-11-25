import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { usePage } from '@inertiajs/react';
import {
  BusinessTripType,
  columns,
  Costcenter,
  Pajak,
  PurchasingGroup,
  UserModel,
} from './models/models';
import { GET_MASTER_ASSET } from '@/endpoint/masterAsset/api';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import {
  DELET_API_BUSINESS_TRIP,
  PRINT_API_BUSINESS_TRIP,
  GET_LIST_BUSINESS_TRIP,
} from '@/endpoint/business-trip/api';
import { AllowanceCategoryModel } from '../AllowanceCategory/model/AllowanceModel';
import { BussinessTripFormV1 } from './components/BussinessTripFormV1';
import { PurposeTypeModel } from '../PurposeType/models/models';
import { DETAIL_PAGE_BUSINESS_TRIP } from '@/endpoint/business-trip/page';
import { DestinationModel } from '../Destination/models/models';
interface propsType {
  listPurposeType: PurposeTypeModel[];
  users: UserModel[];
  pajak: Pajak[];
  costcenter: Costcenter[];
  purchasingGroup: PurchasingGroup[];
  listDestination: DestinationModel[];
}

interface UserAuth {
  id: number;
  name: string;
  email: string;
  role: string;
  role_id: string;
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
  listDestination,
}: propsType) => {
  console.log(costcenter);
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
  const isAdmin = auth.user?.is_admin;
  console.log(auth, ' ini auth');

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
            listDestination={listDestination}
            users={users}
            idUser={userId}
            isAdmin={isAdmin}
            listPurposeType={listPurposeType}
            pajak={pajak}
            costcenter={costcenter}
            purchasingGroup={purchasingGroup}
            type={businessTripForm.type}
            id={businessTripForm.id}
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
        onEdit={(value) => {
          setBusinessTripForm({
            type: BusinessTripType.edit,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        url={{
          url: GET_LIST_BUSINESS_TRIP,
          deleteUrl: DELET_API_BUSINESS_TRIP,
          detailUrl: DETAIL_PAGE_BUSINESS_TRIP,
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
