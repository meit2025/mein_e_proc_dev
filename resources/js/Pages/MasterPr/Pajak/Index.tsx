import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_MASTER_PAJAK, GET_MASTER_PAJAK } from '@/endpoint/pajak/api';
import { CREATE_PAGE_MASTER_PAJAK, EDIT_PAGE_MASTER_PAJAK } from '@/endpoint/pajak/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'master pr tax';
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
        url: GET_MASTER_PAJAK,
        addUrl: CREATE_PAGE_MASTER_PAJAK,
        editUrl: EDIT_PAGE_MASTER_PAJAK,
        deleteUrl: DELET_MASTER_PAJAK,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Tax' description='Tax Create PR'>
    {page}
  </MainLayout>
);

export default Index;
