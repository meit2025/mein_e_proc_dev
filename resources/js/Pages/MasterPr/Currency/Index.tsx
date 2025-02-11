import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_MASTER_CURRENCY, GET_MASTER_CURRENCY } from '@/endpoint/currency/api';
import { CREATE_PAGE_MASTER_CURRENCY, EDIT_PAGE_MASTER_CURRENCY } from '@/endpoint/currency/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'master pr currency';
const roleConfig = {
  detail: `${roleAkses} view`,
  create: `${roleAkses} create`,
  update: `${roleAkses} update`,
  delete: `${roleAkses} delete`,
};
export const Index = () => {
  return (
    <DataGridComponent
      role={roleConfig}
      columns={columns}
      url={{
        url: GET_MASTER_CURRENCY,
        addUrl: CREATE_PAGE_MASTER_CURRENCY,
        editUrl: EDIT_PAGE_MASTER_CURRENCY,
        deleteUrl: DELET_MASTER_CURRENCY,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Currency' description='Currency Create PR'>
    {page}
  </MainLayout>
);

export default Index;
