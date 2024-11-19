import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns } from './models/models';
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

interface propsType {
  // listAllowanceCategory: AllowanceCategoryModel[];
  listAllowance: AllowanceItemModel[];

  // listCurrency: any[];
}
export const Index = ({ listAllowance }: propsType) => {
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
        <Button onClick={openFormHandler}>
          <PlusIcon />
        </Button>

        <ConfirmationDeleteModal open={false} onDelete={() => {}} onCancel={() => {}} />
        <CustomDialog
          onClose={() => setOpenForm(false)}
          open={openForm}
          onOpenChange={openFormHandler}
        >
          <PurposeTypeForm
            detailUrl={GET_DETAIL_PURPOSE_TYPE(formType.id)}
            editUrl={UPDATE_PURPOSE_TYPE(formType.id)}
            type={formType.type}
            createUrl={CREATE_API_PURPOSE_TYPE}
            onSuccess={(value) => {
              if (value) {
                setOpenForm(false);
              }
            }}
            listAllowanceModel={listAllowance}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        onEdit={(value) => {
          setFormType({
            type: FormType.edit,
            id: value,
          });
          setOpenForm(true);
        }}
        columns={columns}
        actionType='dropdown'
        deleteConfirmationText='Are you sure delete this purpose type?'
        url={{
          url: GET_LIST_PURPOSE_TYPE,
          deleteUrl: DELETE_API_PURPOSE_TYPE,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Purpose Type' description='Purpose Type'>
    {page}
  </MainLayout>
);

export default Index;
