import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import {
  DELET_MASTER_MATERIAL_GROUP,
  GET_MASTER_MATERIAL_GROUP,
} from '@/endpoint/materialGroup/api';
import {
  CREATE_PAGE_MASTER_MATERIAL_GROUP,
  EDIT_PAGE_MASTER_MATERIAL_GROUP,
} from '@/endpoint/materialGroup/page';
import { DELET_MASTER_UOM, GET_MASTER_UOM } from '@/endpoint/uom/api';
import { CREATE_PAGE_MASTER_UOM, EDIT_PAGE_MASTER_UOM } from '@/endpoint/uom/page';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_MASTER_UOM,
          addUrl: CREATE_PAGE_MASTER_UOM,
          editUrl: EDIT_PAGE_MASTER_UOM,
          deleteUrl: DELET_MASTER_UOM,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='UOM' description='UOM Create PR'>
    {page}
  </MainLayout>
);

export default Index;
