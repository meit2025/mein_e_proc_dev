import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_SECRET, GET_SECRET } from '@/endpoint/secret/api';
import { columns } from './model/listModel';
import { CREATE_PAGE_PR, EDIT_PAGE_PR } from '@/endpoint/purchaseRequisition/page';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_SECRET,
          addUrl: CREATE_PAGE_PR,
          editUrl: EDIT_PAGE_PR,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Secret' description='Secret Key hit api'>
    {page}
  </MainLayout>
);

export default Index;
