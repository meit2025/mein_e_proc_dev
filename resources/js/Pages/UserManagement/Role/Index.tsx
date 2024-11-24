import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { DELET_ROLE, GET_ROLE } from '@/endpoint/role/api';
import { CREATE_PAGE_ROLE, DETAIL_PAGE_ROLE, EDIT_PAGE_ROLE } from '@/endpoint/role/page';

const roleAkses = 'role';
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
        url: GET_ROLE,
        addUrl: CREATE_PAGE_ROLE,
        editUrl: EDIT_PAGE_ROLE,
        deleteUrl: DELET_ROLE,
        detailUrl: DETAIL_PAGE_ROLE,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Role' description='Role'>
    {page}
  </MainLayout>
);

export default Index;
