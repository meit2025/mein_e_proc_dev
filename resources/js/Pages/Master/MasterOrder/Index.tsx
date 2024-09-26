import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/Components/commons/DataGrid';
import { columns } from './model/listModel';
import { GET_MASTER_ORDER } from '@/endpoint/masterOrder/api';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_MASTER_ORDER,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master' description='Master Order'>
    {page}
  </MainLayout>
);

export default Index;
