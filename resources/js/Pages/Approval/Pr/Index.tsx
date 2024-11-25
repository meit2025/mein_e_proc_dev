import DataGridComponent from '@/components/commons/DataGrid';
import {
  DELET_SETTING_APPROVAL_PR,
  GET_SETTING_APPROVAL_PR,
} from '@/endpoint/settingApprovalPr/api';
import {
  CREATE_PAGE_SETTING_APPROVAL_PR,
  EDIT_PAGE_SETTING_APPROVAL_PR,
} from '@/endpoint/settingApprovalPr/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'approval pr';
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
          url: GET_SETTING_APPROVAL_PR,
          addUrl: CREATE_PAGE_SETTING_APPROVAL_PR,
          editUrl: EDIT_PAGE_SETTING_APPROVAL_PR,
          deleteUrl: DELET_SETTING_APPROVAL_PR,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Approval Route PR' description='Approval Route PR Create'>
    {page}
  </MainLayout>
);

export default Index;
