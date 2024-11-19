import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { ReimburseForm } from './components/ReimburseForm';
import {
  LIST_REIMBURSE,
  UPDATE_REIMBURSE,
  STORE_REIMBURSE,
  DETAIL_REIMBURSE,
} from '@/endpoint/reimburse/api';
import { FormType } from '@/lib/utils';
import { Currency, Period, PurchasingGroup, User, Tax, CostCenter } from './model/listModel';
import { PAGE_EDIT_REIMBURSE } from '@/endpoint/reimburse/page';
import { AsyncDropdownComponent } from '@/components/commons/AsyncDropdownComponent';

interface Props {
  users: User[];
  categories: string;
  periods: Period[];
  currencies: Currency[];
  purchasing_groups: PurchasingGroup[];
  taxes: Tax[];
  cost_center: CostCenter[];
  currentUser: User;
  latestPeriod: any;
}

export const Index = ({
  purchasing_groups,
  users,
  categories,
  currencies,
  taxes,
  cost_center,
  periods,
  currentUser,
  latestPeriod,
}: Props) => {
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

  const [selectValue, setSelectValue] = React.useState('');

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
          <ReimburseForm
            purchasing_groups={purchasing_groups}
            users={users}
            categories={categories}
            currencies={currencies}
            periods={periods}
            currentUser={currentUser}
            latestPeriod={latestPeriod}
            taxes={taxes}
            cost_center={cost_center}
            edit_url={DETAIL_REIMBURSE(formType.id)}
            update_url={UPDATE_REIMBURSE(formType.id)}
            store_url={STORE_REIMBURSE}
            type={formType.type}
            onSuccess={(value) => {
              setOpenForm(false);
            }}
          />
        </CustomDialog>
      </div>

      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        onEdit={(value) => {
          setFormType({
            type: FormType.edit,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        url={{
          url: LIST_REIMBURSE,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Reimburse' description='Reimburse'>
    {page}
  </MainLayout>
);

export default Index;
