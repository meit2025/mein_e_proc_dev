import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns } from './models/models';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { GET_LIST_REIMBURSE_TYPE } from '@/endpoint/reimburseType/api';
import { ListTypeModel } from '../MasterReimburseType/models/models';
import { ListPeriodModel } from '../MasterReimbursePeriod/models/models';
import { BusinessTripGrade } from '@/Pages/BusinessTrip/BusinessGrade/model/model';
import ReimburseQuotaForm from './component/form';
import { GET_LIST_REIMBURSE_QUOTA } from '@/endpoint/reimburseQuota/api';

interface propsType {
  listTypeReimburse: ListTypeModel[];
  listPeriodReimburse: ListPeriodModel[];
  listGrade: BusinessTripGrade[];
}

export const Index = ({ listTypeReimburse, listPeriodReimburse, listGrade }: propsType) => {
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
          <ReimburseQuotaForm
            listTypeReimburse={listTypeReimburse}
            listPeriodReimburse={listPeriodReimburse}
            listGrade={listGrade}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        url={{
          url: GET_LIST_REIMBURSE_QUOTA,
        }}
        labelFilter='search'
      />
    </>
  );
};

Index.layout = (page: ReactNode) => (
  <MainLayout title='Reimburse Quota' description='Reimburse Quota'>
    {page}
  </MainLayout>
);

export default Index;
