import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import {
  DELET_MASTER_PURCHASING_GROUP,
  GET_MASTER_PURCHASING_GROUP,
} from '@/endpoint/purchasingGroup/api';
import {
  CREATE_PAGE_MASTER_PURCHASING_GROUP,
  EDIT_PAGE_MASTER_PURCHASING_GROUP,
} from '@/endpoint/purchasingGroup/page';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_MASTER_PURCHASING_GROUP,
          addUrl: CREATE_PAGE_MASTER_PURCHASING_GROUP,
          editUrl: EDIT_PAGE_MASTER_PURCHASING_GROUP,
          deleteUrl: DELET_MASTER_PURCHASING_GROUP,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Purchasing Group' description='Purchasing Group Create PR'>
    {page}
  </MainLayout>
);

export default Index;
