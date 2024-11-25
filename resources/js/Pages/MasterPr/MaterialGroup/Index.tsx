import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import {
  DELET_MASTER_MATERIAL_GROUP,
  GET_MASTER_MATERIAL_GROUP,
} from '@/endpoint/materialGroup/api';
import {
  CREATE_PAGE_MASTER_MATERIAL_GROUP,
  EDIT_PAGE_MASTER_MATERIAL_GROUP,
} from '@/endpoint/materialGroup/page';

const roleAkses = 'master pr material group';
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
          url: GET_MASTER_MATERIAL_GROUP,
          addUrl: CREATE_PAGE_MASTER_MATERIAL_GROUP,
          editUrl: EDIT_PAGE_MASTER_MATERIAL_GROUP,
          deleteUrl: DELET_MASTER_MATERIAL_GROUP,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Material Group' description='Material Group Create PR'>
    {page}
  </MainLayout>
);

export default Index;
