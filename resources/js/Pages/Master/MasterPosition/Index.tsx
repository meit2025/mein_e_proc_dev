import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_MASTER_POSITION, GET_MASTER_POSITION } from '@/endpoint/masterPosition/api';
import {
  CREATE_PAGE_MASTER_POSITION,
  DETAIL_PAGE_MASTER_POSITION,
  EDIT_PAGE_MASTER_POSITION,
} from '@/endpoint/masterPosition/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'position';
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
        url: GET_MASTER_POSITION,
        addUrl: CREATE_PAGE_MASTER_POSITION,
        editUrl: EDIT_PAGE_MASTER_POSITION,
        deleteUrl: DELET_MASTER_POSITION,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master Postion' description='Master Postion'>
    {page}
  </MainLayout>
);

export default Index;
