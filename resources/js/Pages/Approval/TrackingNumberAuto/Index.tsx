import DataGridComponent from '@/components/commons/DataGrid';
import {
  DELET_TRACKING_NUMBER_AUTO,
  GET_TRACKING_NUMBER_AUTO,
} from '@/endpoint/approvalTrackingNumberAuto/api';
import {
  CREATE_PAGE_TRACKING_NUMBER_AUTO,
  EDIT_PAGE_TRACKING_NUMBER_AUTO,
} from '@/endpoint/approvalTrackingNumberAuto/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'tracking number auto';
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
          url: GET_TRACKING_NUMBER_AUTO,
          addUrl: CREATE_PAGE_TRACKING_NUMBER_AUTO,
          editUrl: EDIT_PAGE_TRACKING_NUMBER_AUTO,
          deleteUrl: DELET_TRACKING_NUMBER_AUTO,
        }}
        labelFilter='search'
      />
    </>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout
    title='Approval Route Tracking Number Auto'
    description='Approval Route Tracking Number Auto Create'
  >
    {page}
  </MainLayout>
);

export default Index;
