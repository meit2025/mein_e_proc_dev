import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import {
  DELET_MASTER_VALUATION_TYPE,
  GET_MASTER_VALUATION_TYPE,
} from '@/endpoint/valuationType/api';
import {
  CREATE_PAGE_MASTER_VALUATION_TYPE,
  EDIT_PAGE_MASTER_VALUATION_TYPE,
} from '@/endpoint/valuationType/page';

const roleAkses = 'master pr item category';
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
          url: GET_MASTER_VALUATION_TYPE,
          addUrl: CREATE_PAGE_MASTER_VALUATION_TYPE,
          editUrl: EDIT_PAGE_MASTER_VALUATION_TYPE,
          deleteUrl: DELET_MASTER_VALUATION_TYPE,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Item Category' description='Item Category Create PR'>
    {page}
  </MainLayout>
);

export default Index;
