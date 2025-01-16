import DataGridComponent from '@/components/commons/DataGrid';
import {
  DELET_MASTER_PURCHASING_GROUP,
  GET_MASTER_PURCHASING_GROUP,
} from '@/endpoint/purchasingGroup/api';
import {
  CREATE_PAGE_MASTER_PURCHASING_GROUP,
  EDIT_PAGE_MASTER_PURCHASING_GROUP,
} from '@/endpoint/purchasingGroup/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'master pr purchasing group';
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
        url: GET_MASTER_PURCHASING_GROUP,
        addUrl: CREATE_PAGE_MASTER_PURCHASING_GROUP,
        editUrl: EDIT_PAGE_MASTER_PURCHASING_GROUP,
        deleteUrl: DELET_MASTER_PURCHASING_GROUP,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Purchasing Group' description='Purchasing Group Create PR'>
    {page}
  </MainLayout>
);

export default Index;
