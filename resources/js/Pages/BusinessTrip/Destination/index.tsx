import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns, DestinationModel } from './models/models';
import { GET_MASTER_ASSET } from '@/endpoint/masterAsset/api';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { GET_LIST_ALLOWANCE_ITEM } from '@/endpoint/allowance-item/api';
import { AllowanceCategoryModel } from '../AllowanceCategory/model/AllowanceModel';
import PurposeTypeForm from './component/form';
import { AllowanceItemModel } from '../AllowanceItem/models/models';
import {
  CREATE_API_PURPOSE_TYPE,
  DELETE_API_PURPOSE_TYPE,
  GET_DETAIL_PURPOSE_TYPE,
  GET_LIST_PURPOSE_TYPE,
  UPDATE_PURPOSE_TYPE,
} from '@/endpoint/purpose-type/api';
import { FormType } from '@/lib/utils';
import { ConfirmationDeleteModal } from '@/components/commons/ConfirmationDeleteModal';
import {
  CREATE_API_DESTINATION,
  DELETE_API_DESTINATION,
  GET_DETAIL_DESTINATION,
  GET_LIST_DESTINATION,
  UPDATE_DESTINATION,
} from '@/endpoint/destination/api';
import DestinationForm from './component/form';

const roleAkses = 'master business trip destination';

interface propsType {
  // listAllowanceCategory: AllowanceCategoryModel[];
  listDestination: DestinationModel[];

  // listCurrency: any[];
}
export const Index = ({ listDestination }: propsType) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);
  const [formType, setFormType] = React.useState({
    type: FormType.create,
    id: null,
  });

  function openFormHandler() {
    setFormType({
      id: null,
      type: FormType.create,
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
          <DestinationForm
            detailUrl={GET_DETAIL_DESTINATION(formType.id)}
            editUrl={UPDATE_DESTINATION(formType.id)}
            type={formType.type}
            createUrl={CREATE_API_DESTINATION}
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
        onEdit={(value) => {
          setFormType({
            type: FormType.edit,
            id: value,
          });
          setOpenForm(true);
        }}
        columns={columns}
        actionType='dropdown'
        deleteConfirmationText='Are you sure delete this destination ?'
        url={{
          url: GET_LIST_DESTINATION,
          deleteUrl: DELETE_API_DESTINATION,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Destination' description='Destination'>
    {page}
  </MainLayout>
);

export default Index;
