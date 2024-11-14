import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';

import {
  DELET_MASTER_STORAGE_LOCATION,
  GET_MASTER_STORAGE_LOCATION,
} from '@/endpoint/storageLocation/api';
import {
  CREATE_PAGE_MASTER_STORAGE_LOCATION,
  EDIT_PAGE_MASTER_STORAGE_LOCATION,
} from '@/endpoint/storageLocation/page';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_MASTER_STORAGE_LOCATION,
          addUrl: CREATE_PAGE_MASTER_STORAGE_LOCATION,
          editUrl: EDIT_PAGE_MASTER_STORAGE_LOCATION,
          deleteUrl: DELET_MASTER_STORAGE_LOCATION,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Storage Location' description='Storage Location Create PR'>
    {page}
  </MainLayout>
);

export default Index;
