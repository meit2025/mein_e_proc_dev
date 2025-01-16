import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_MASTER_UOM, GET_MASTER_UOM } from '@/endpoint/uom/api';
import { CREATE_PAGE_MASTER_UOM, EDIT_PAGE_MASTER_UOM } from '@/endpoint/uom/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'master pr uom';
const roleConfig = {
  detail: `${roleAkses} view`,
  create: `${roleAkses} create`,
  update: `${roleAkses} update`,
  delete: `${roleAkses} delete`,
};
export const Index = () => {
  return (
    <>
      <DataGridComponent
        role={roleConfig}
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
