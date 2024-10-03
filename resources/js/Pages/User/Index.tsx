import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_USER, GET_USER } from '@/endpoint/user/api';
import { CREATE_PAGE_USER, EDIT_PAGE_USER } from '@/endpoint/user/page';
import { columns } from './model/listModel';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_USER,
          addUrl: CREATE_PAGE_USER,
          editUrl: EDIT_PAGE_USER,
          deleteUrl: DELET_USER,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='User' description='User management'>
    {page}
  </MainLayout>
);

export default Index;
