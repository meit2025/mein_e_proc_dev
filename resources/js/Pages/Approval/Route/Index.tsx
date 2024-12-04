import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { DELET_APPROVAL_ROUTE, GET_APPROVAL_ROUTE } from '@/endpoint/approvalRoute/api';
import {
  CREATE_PAGE_APPROVAL_ROUTE,
  DETAIL_PAGE_APPROVAL_ROUTE,
  EDIT_PAGE_APPROVAL_ROUTE,
} from '@/endpoint/approvalRoute/page';

const roleAkses = 'approval';
export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        role={{
          detail: `${roleAkses} view`,
          create: `${roleAkses} create`,
          update: `${roleAkses} update`,
          delete: `${roleAkses} delete`,
        }}
        url={{
          url: GET_APPROVAL_ROUTE,
          addUrl: CREATE_PAGE_APPROVAL_ROUTE,
          editUrl: EDIT_PAGE_APPROVAL_ROUTE,
          deleteUrl: DELET_APPROVAL_ROUTE,
          detailUrl: DETAIL_PAGE_APPROVAL_ROUTE,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Approval Route' description='Approval Route Create'>
    {page}
  </MainLayout>
);

export default Index;
