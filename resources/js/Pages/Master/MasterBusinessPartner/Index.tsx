import DataGridComponent from '@/components/commons/DataGrid';
import { GET_MASTER_BUSINESS_PARTNER } from '@/endpoint/masterBusinessPartner/api';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'master sap business partner';
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
        url: GET_MASTER_BUSINESS_PARTNER,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master' description='Master Vendor/employee'>
    {page}
  </MainLayout>
);

export default Index;
