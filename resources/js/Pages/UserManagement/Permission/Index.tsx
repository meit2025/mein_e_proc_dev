import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { DELET_MASTER_PERMISSION, GET_MASTER_PERMISSION } from '@/endpoint/permission/api';
import {
  CREATE_PAGE_MASTER_PERMISSION,
  EDIT_PAGE_MASTER_PERMISSION,
} from '@/endpoint/permission/page';

const roleAkses = 'role permission';
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
          url: GET_MASTER_PERMISSION,
          addUrl: CREATE_PAGE_MASTER_PERMISSION,
          editUrl: EDIT_PAGE_MASTER_PERMISSION,
          deleteUrl: DELET_MASTER_PERMISSION,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Permission' description='Permission Role'>
    {page}
  </MainLayout>
);

export default Index;
