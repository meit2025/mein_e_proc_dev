import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_MASTER_EXCHANGERATE, GET_MASTER_EXCHANGERATE } from '@/endpoint/exchangeRate/api';
import { CREATE_PAGE_MASTER_EXCHANGERATE, EDIT_PAGE_MASTER_EXCHANGERATE } from '@/endpoint/exchangeRate/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'master pr exchange rate';
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
        url: GET_MASTER_EXCHANGERATE,
        addUrl: CREATE_PAGE_MASTER_EXCHANGERATE,
        editUrl: EDIT_PAGE_MASTER_EXCHANGERATE,
        deleteUrl: DELET_MASTER_EXCHANGERATE,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Exchange Rate' description='Exchange Rate List'>
    {page}
  </MainLayout>
);

export default Index;
