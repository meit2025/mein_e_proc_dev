import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_MASTER_DIVISION, GET_MASTER_DIVISION } from '@/endpoint/masterDivision/api';
import {
  CREATE_PAGE_MASTER_DIVISION,
  EDIT_PAGE_MASTER_DIVISION,
} from '@/endpoint/masterDivision/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'division';
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
        url: GET_MASTER_DIVISION,
        addUrl: CREATE_PAGE_MASTER_DIVISION,
        editUrl: EDIT_PAGE_MASTER_DIVISION,
        deleteUrl: DELET_MASTER_DIVISION,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master Division' description='Master Division'>
    {page}
  </MainLayout>
);

export default Index;
