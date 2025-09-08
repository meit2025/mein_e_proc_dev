import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns } from './models/models';
import { GET_MASTER_ASSET } from '@/endpoint/masterAsset/api';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import {
  CREATE_API_ALLOWANCE_ITEM,
  DELETE_API_ALLOWANCE_ITEM,
  GET_DETAIL_ALLOWANCE_ITEM,
  GET_LIST_ALLOWANCE_ITEM,
  UPDATE_ALLOWANCE_ITEM,
} from '@/endpoint/allowance-item/api';
import { AllowanceCategoryModel } from '../AllowanceCategory/model/AllowanceModel';
import AllowanceItemForm from './component/form';
import { BusinessTripGrade } from '../BusinessGrade/model/model';
import { MaterialModel } from '@/Pages/Master/MasterMaterial/model/listModel';
import { FormType } from '@/lib/utils';

interface propsType {
  listAllowanceCategory: AllowanceCategoryModel[];
  listCurrency: any[];
  listGrade: BusinessTripGrade[];
}
const roleAkses = 'master business trip allowance item';
export const Index = ({ listAllowanceCategory, listCurrency, listGrade }: propsType) => {
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
          <AllowanceItemForm
            type={formType.type}
            editUrl={UPDATE_ALLOWANCE_ITEM(formType.id)}
            detailUrl={GET_DETAIL_ALLOWANCE_ITEM(formType.id)}
            createUrl={CREATE_API_ALLOWANCE_ITEM}
            listGrade={listGrade}
            listCurrency={listCurrency}
            listAllowanceCategory={listAllowanceCategory}
            onSuccess={() => {
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
        columns={columns}
        actionType='dropdown'
        onCreate={openFormHandler}
        onEdit={(value) => {
          setFormType({
            type: FormType.edit,
            id: value,
          });
          setOpenForm(true);
        }}
        url={{
          url: GET_LIST_ALLOWANCE_ITEM,
          deleteUrl: DELETE_API_ALLOWANCE_ITEM,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Allowance Item' description='Allowance Item'>
    {page}
  </MainLayout>
);

export default Index;
