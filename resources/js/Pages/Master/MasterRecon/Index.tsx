import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { GET_MASTER_MATERIAL } from '@/endpoint/masterMaterial/api';
import { GET_MASTER_RECON } from '@/endpoint/masterRecon/api';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_MASTER_RECON,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master' description='Master Recon'>
    {page}
  </MainLayout>
);

export default Index;
