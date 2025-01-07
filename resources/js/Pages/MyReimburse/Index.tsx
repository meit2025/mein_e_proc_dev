import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import CustomTab from '@/components/commons/CustomTab';
import { contentsTabs, labelsTabs } from './model/listModel';

interface Props {}

export const Index = ({}: Props) => {
  return (
    <CustomTab tabLabels={labelsTabs} tabContents={contentsTabs()} />
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='My Reimbursement' description='My Reimbursement'>
    {page}
  </MainLayout>
);

export default Index;
