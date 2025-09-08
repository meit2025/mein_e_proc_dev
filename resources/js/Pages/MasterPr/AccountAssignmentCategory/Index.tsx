import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import {
  DELET_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
  GET_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
} from '@/endpoint/accountAssignmentCategory/api';
import {
  CREATE_PAGE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
  EDIT_PAGE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
} from '@/endpoint/accountAssignmentCategory/page';

const roleAkses = 'master pr account assignment category';
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
        url: GET_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
        addUrl: CREATE_PAGE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
        editUrl: EDIT_PAGE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
        deleteUrl: DELET_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
      }}
      labelFilter='search'
    />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout
    title='Account Assignment Category'
    description='Account Assignment Category Create PR'
  >
    {page}
  </MainLayout>
);

export default Index;
