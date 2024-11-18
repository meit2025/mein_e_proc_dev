import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { DELET_MASTER_UOM, GET_MASTER_UOM } from '@/endpoint/uom/api';
import { CREATE_PAGE_MASTER_UOM, EDIT_PAGE_MASTER_UOM } from '@/endpoint/uom/page';
import { DELET_MASTER_PAJAK, GET_MASTER_PAJAK } from '@/endpoint/pajak/api';
import { CREATE_PAGE_MASTER_PAJAK, EDIT_PAGE_MASTER_PAJAK } from '@/endpoint/pajak/page';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_MASTER_PAJAK,
          addUrl: CREATE_PAGE_MASTER_PAJAK,
          editUrl: EDIT_PAGE_MASTER_PAJAK,
          deleteUrl: DELET_MASTER_PAJAK,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Tax' description='Tax Create PR'>
    {page}
  </MainLayout>
);

export default Index;
