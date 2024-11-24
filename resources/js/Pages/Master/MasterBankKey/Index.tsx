import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { GET_MASTER_BANK_KEY } from '@/endpoint/masterBankKey/api';

const roleAkses = 'master sap bank key';
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
        url: GET_MASTER_BANK_KEY,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master' description='Master Bank Key'>
    {page}
  </MainLayout>
);

export default Index;
