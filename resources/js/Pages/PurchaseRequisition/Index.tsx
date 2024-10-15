import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_PR, GET_PR } from '@/endpoint/purchaseRequisition/api';
import { columns } from './model/listModel';
import { CREATE_PAGE_PR, EDIT_PAGE_PR } from '@/endpoint/purchaseRequisition/page';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_PR,
          addUrl: CREATE_PAGE_PR,
          editUrl: EDIT_PAGE_PR,
          deleteUrl: DELET_PR,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Purchase Requisition' description='Purchase Requisition List'>
    {page}
  </MainLayout>
);

export default Index;
