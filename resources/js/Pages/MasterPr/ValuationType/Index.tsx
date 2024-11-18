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

export const Index = () => {
  return (
    <>
      <DataGridComponent
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
  <MainLayout title='Valuation Type' description='Valuation Type Create PR'>
    {page}
  </MainLayout>
);

export default Index;
