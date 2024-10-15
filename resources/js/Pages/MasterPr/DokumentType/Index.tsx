import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { DELET_MASTER_DOKUMENT_TYPE, GET_MASTER_DOKUMENT_TYPE } from '@/endpoint/dokumentType/api';
import {
  CREATE_PAGE_MASTER_DOKUMENT_TYPE,
  EDIT_PAGE_MASTER_DOKUMENT_TYPE,
} from '@/endpoint/dokumentType/page';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_MASTER_DOKUMENT_TYPE,
          addUrl: CREATE_PAGE_MASTER_DOKUMENT_TYPE,
          editUrl: EDIT_PAGE_MASTER_DOKUMENT_TYPE,
          deleteUrl: DELET_MASTER_DOKUMENT_TYPE,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Dokument Type' description='Dokument Type Create PR'>
    {page}
  </MainLayout>
);

export default Index;
