import DataGridComponent from '@/components/commons/DataGrid';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

import {
  DELET_MASTER_STORAGE_LOCATION,
  GET_MASTER_STORAGE_LOCATION,
} from '@/endpoint/storageLocation/api';
import {
  CREATE_PAGE_MASTER_STORAGE_LOCATION,
  EDIT_PAGE_MASTER_STORAGE_LOCATION,
} from '@/endpoint/storageLocation/page';

const roleAkses = 'master pr storage location';
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
        url: GET_MASTER_STORAGE_LOCATION,
        addUrl: CREATE_PAGE_MASTER_STORAGE_LOCATION,
        editUrl: EDIT_PAGE_MASTER_STORAGE_LOCATION,
        deleteUrl: DELET_MASTER_STORAGE_LOCATION,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Storage Location' description='Storage Location Create PR'>
    {page}
  </MainLayout>
);

export default Index;
