import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { GET_MASTER_MATERIAL } from '@/endpoint/masterMaterial/api';

const roleAkses = 'master sap material';
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
        url: GET_MASTER_MATERIAL,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master' description='Master Material'>
    {page}
  </MainLayout>
);

export default Index;
