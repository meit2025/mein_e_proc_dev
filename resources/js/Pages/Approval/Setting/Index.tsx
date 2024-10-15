import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { DELET_SETTING_APPROVAL, GET_SETTING_APPROVAL } from '@/endpoint/settingApproval/api';
import {
  CREATE_PAGE_SETTING_APPROVAL,
  EDIT_PAGE_SETTING_APPROVAL,
} from '@/endpoint/settingApproval/page';

export const Index = () => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        url={{
          url: GET_SETTING_APPROVAL,
          addUrl: CREATE_PAGE_SETTING_APPROVAL,
          editUrl: EDIT_PAGE_SETTING_APPROVAL,
          deleteUrl: DELET_SETTING_APPROVAL,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Approval Setting' description='Approval Setting Create'>
    {page}
  </MainLayout>
);

export default Index;
