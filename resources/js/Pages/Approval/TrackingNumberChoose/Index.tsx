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
import {
  DELET_TRACKING_NUMBER_CHOOSE,
  GET_TRACKING_NUMBER_CHOOSE,
} from '@/endpoint/approvalTrackingNumberChoose/api';
import {
  CREATE_PAGE_TRACKING_NUMBER_CHOOSE,
  EDIT_PAGE_TRACKING_NUMBER_CHOOSE,
} from '@/endpoint/approvalTrackingNumberChoose/page';

const roleAkses = 'tracking number choose';
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
          url: GET_TRACKING_NUMBER_CHOOSE,
          addUrl: CREATE_PAGE_TRACKING_NUMBER_CHOOSE,
          editUrl: EDIT_PAGE_TRACKING_NUMBER_CHOOSE,
          deleteUrl: DELET_TRACKING_NUMBER_CHOOSE,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout
    title='Approval Route Tracking Number Choose'
    description='Approval Route Tracking Number Choose Create'
  >
    {page}
  </MainLayout>
);

export default Index;
