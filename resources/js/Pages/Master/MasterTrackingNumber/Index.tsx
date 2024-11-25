import DataGridComponent from '@/components/commons/DataGrid';
import {
  DELET_MASTER_TRACKING_NUMBER,
  GET_MASTER_TRACKING_NUMBER,
} from '@/endpoint/masterTrackingNumber/api';
import {
  CREATE_PAGE_MASTER_TRACKING_NUMBER,
  EDIT_PAGE_MASTER_TRACKING_NUMBER,
} from '@/endpoint/masterTrackingNumber/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import { columns } from './model/listModel';

const roleAkses = 'tracking number';
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
        url: GET_MASTER_TRACKING_NUMBER,
        addUrl: CREATE_PAGE_MASTER_TRACKING_NUMBER,
        editUrl: EDIT_PAGE_MASTER_TRACKING_NUMBER,
        deleteUrl: DELET_MASTER_TRACKING_NUMBER,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Master Tracking Number' description='Master Tracking Number'>
    {page}
  </MainLayout>
);

export default Index;
