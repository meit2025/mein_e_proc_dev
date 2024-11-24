import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_MASTER_DEPARTMENT, GET_MASTER_DEPARTMENT } from '@/endpoint/masterDepartment/api';
import {
  CREATE_PAGE_MASTER_DEPARTMENT,
  EDIT_PAGE_MASTER_DEPARTMENT,
} from '@/endpoint/masterDepartment/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'department';
const roleConfig = {
  detail: `${roleAkses} view`,
  create: `${roleAkses} create`,
  update: `${roleAkses} update`,
  delete: `${roleAkses} delete`,
};
export const Index = () => {
  return (
    <DataGridComponent
      role={roleConfig}
      columns={columns}
      url={{
        url: GET_MASTER_DEPARTMENT,
        addUrl: CREATE_PAGE_MASTER_DEPARTMENT,
        editUrl: EDIT_PAGE_MASTER_DEPARTMENT,
        deleteUrl: DELET_MASTER_DEPARTMENT,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master Department' description='Master Department'>
    {page}
  </MainLayout>
);

export default Index;
