import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_PR, GET_PR } from '@/endpoint/purchaseRequisition/api';
import { columns } from './model/listModel';
import { CREATE_PAGE_PR, DETAIL_PAGE_PR, EDIT_PAGE_PR } from '@/endpoint/purchaseRequisition/page';

const roleAkses = 'purchase requisition';
const roleConfig = {
  detail: `${roleAkses} view`,
  create: `${roleAkses} create`,
  update: `${roleAkses} update`,
  delete: `${roleAkses} delete`,
};
export const Index = () => {
  const urlConfig = {
    url: GET_PR,
    addUrl: CREATE_PAGE_PR,
    editUrl: EDIT_PAGE_PR,
    deleteUrl: DELET_PR,
    detailUrl: DETAIL_PAGE_PR,
  };

  return (
    <DataGridComponent
      isHistory={true}
      role={roleConfig}
      columns={columns}
      url={urlConfig}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Purchase Requisition' description='Purchase Requisition List'>
    {page}
  </MainLayout>
);

export default Index;
