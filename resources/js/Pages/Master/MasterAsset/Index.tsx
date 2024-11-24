import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { GET_MASTER_ASSET } from '@/endpoint/masterAsset/api';

const roleAkses = 'master sap asset';
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
        url: GET_MASTER_ASSET,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master' description='Master Asset'>
    {page}
  </MainLayout>
);

export default Index;
