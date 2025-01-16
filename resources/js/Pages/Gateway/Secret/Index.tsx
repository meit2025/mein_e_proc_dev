import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_SECRET, GET_SECRET } from '@/endpoint/secret/api';
import { CREATE_PAGE_SECRET, EDIT_PAGE_SECRET } from '@/endpoint/secret/page';
import { columns } from './model/listModel';

const roleAkses = 'purchase requisition';
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
        url: GET_SECRET,
        addUrl: CREATE_PAGE_SECRET,
        editUrl: EDIT_PAGE_SECRET,
        deleteUrl: DELET_SECRET,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Secret' description='Secret Key hit api'>
    {page}
  </MainLayout>
);

export default Index;
