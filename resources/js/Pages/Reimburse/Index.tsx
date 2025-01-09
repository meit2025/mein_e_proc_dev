import { CustomDialog } from '@/components/commons/CustomDialog';
import DataGridComponent from '@/components/commons/DataGrid';
import {
  DETAIL_REIMBURSE,
  LIST_REIMBURSE,
  STORE_REIMBURSE,
  UPDATE_REIMBURSE,
} from '@/endpoint/reimburse/api';
import {
  PAGE_DETAIL_REIMBURSE,
  CLONE_REIMBURSE
} from '@/endpoint/reimburse/page';
import { FormType } from '@/lib/utils';
import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import { ReimburseForm } from './components/ReimburseForm';
import { columns, CostCenter, Currency, PurchasingGroup, User, ReimburseFormType } from './model/listModel';

interface Props {
  users: User[];
  categories: string;
  currencies: Currency[];
  purchasing_groups: PurchasingGroup[];
  cost_center: CostCenter[];
  currentUser: User;
  taxDefaultValue: string;
  uomDefaultValue: string;
  latestPeriod: any;
}

const roleAkses = 'reimburse';
const roleConfig = {
  detail: `${roleAkses} view`,
  create: `${roleAkses} create`,
  update: `${roleAkses} update`,
  delete: `${roleAkses} delete`,
};

export const Index = ({
  purchasing_groups,
  users,
  categories,
  currencies,
  cost_center,
  currentUser,
  taxDefaultValue,
  uomDefaultValue
}: Props) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);
  const [formType, setFormType] = React.useState({
    type: ReimburseFormType.create,
    id: undefined,
  });

  function openFormHandler() {
    setFormType({
      type: ReimburseFormType.create,
      id: null,
    });
    setOpenForm(!openForm);
  }

  return (
    <>
      <div className='flex md:mb-4 mb-2 w-full justify-end'>
        <CustomDialog
          onClose={() => setOpenForm(false)}
          open={openForm}
          onOpenChange={openFormHandler}
        >
          <ReimburseForm
            purchasing_groups={purchasing_groups}
            taxDefaultValue={taxDefaultValue}
            uomDefaultValue={uomDefaultValue}
            users={users}
            categories={categories}
            currencies={currencies}
            currentUser={currentUser}
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

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        <div>
          {/* <FormField
                control={form.control}
                name='created_at'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomDatePicker
                        initialDate={field.value}
                        onDateChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
          {/* <label htmlFor="">Created Date: </label>
              <CustomDatePicker
              className='!w-full'
                // initialDate={field.value}
                // onDateChange={(date) => field.onChange(date)}
              /> */}
        </div>
      </div>

      <DataGridComponent
        isHistory={true}
        role={roleConfig}
        onCreate={openFormHandler}
        columns={columns}
        onEdit={(value) => {
          setFormType({
            type: ReimburseFormType.edit,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        onClone={(value) => {
          setFormType({
            type: ReimburseFormType.clone,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        url={{
          url: LIST_REIMBURSE,
          detailUrl: PAGE_DETAIL_REIMBURSE,
          clone: CLONE_REIMBURSE,
          cancelApproval: 'reim',
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
