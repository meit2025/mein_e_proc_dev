import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/Components/commons/DataGrid';
import { columns } from './model/listModel';
import { DELET_API, GET_API } from '@/endpoint/getway/api';
import { CREATE_PAGE_API, DETAIL_PAGE_API, EDIT_PAGE_API } from '@/endpoint/getway/page';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_API,
          addUrl: CREATE_PAGE_API,
          editUrl: EDIT_PAGE_API,
          deleteUrl: DELET_API,
          detailUrl: DETAIL_PAGE_API,
        }}
        labelFilter='search employee'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='API' description='create endpoint api'>
    {page}
  </MainLayout>
);

export default Index;
