import DataGridComponent from '@/components/commons/DataGrid';
import {
  DELET_APPROVAL_CONDITIONAL_USER,
  GET_APPROVAL_CONDITIONAL_USER,
} from '@/endpoint/settingApprovalPrConditionalUser/api';
import {
  CREATE_PAGE_APPROVAL_CONDITIONAL_USER,
  DETAIL_PAGE_APPROVAL_CONDITIONAL_USER,
  EDIT_PAGE_APPROVAL_CONDITIONAL_USER,
} from '@/endpoint/settingApprovalPrConditionalUser/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'approval conditional user';
export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        role={{
          detail: `${roleAkses} view`,
          create: `${roleAkses} create`,
          update: `${roleAkses} update`,
          delete: `${roleAkses} delete`,
        }}
        url={{
          url: GET_APPROVAL_CONDITIONAL_USER,
          addUrl: CREATE_PAGE_APPROVAL_CONDITIONAL_USER,
          editUrl: EDIT_PAGE_APPROVAL_CONDITIONAL_USER,
          deleteUrl: DELET_APPROVAL_CONDITIONAL_USER,
          detailUrl: DETAIL_PAGE_APPROVAL_CONDITIONAL_USER,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Approval Conditional User' description='Approval Conditional User Create'>
    {page}
  </MainLayout>
);

export default Index;
