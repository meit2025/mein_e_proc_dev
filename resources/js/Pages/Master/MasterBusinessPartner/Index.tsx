import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { GET_MASTER_BANK_KEY } from '@/endpoint/masterBankKey/api';
import { GET_MASTER_BUSINESS_PARTNER } from '@/endpoint/masterBusinessPartner/api';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_MASTER_BUSINESS_PARTNER,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master' description='Master Vendor/employee'>
    {page}
  </MainLayout>
);

export default Index;
