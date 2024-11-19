import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import { columns } from './models/detailModels';
import { LIST_API_DETAIL_REIMBURSE_QUOTA} from '@/endpoint/reimburseQuota/api';

export const Detail = ( {masterReimburseQuotaData} : { masterReimburseQuotaData: any } ) => {
  
  return (
    <>
      <div className='flex md:mb-4 mb-2 w-full'>
        <table className='border-0 text-sm'>
          <tr>
            <td width="200">Reimburse Type</td>
            <td>: {masterReimburseQuotaData.type.name}</td>
          </tr>
          <tr>
            <td width="200">Reimburse Period</td>
            <td>: {`${masterReimburseQuotaData.period.code} ( ${masterReimburseQuotaData.period.start} - ${masterReimburseQuotaData.period.end} )`}</td>
          </tr>
          <tr>
            <td width="200">Employer Status</td>
            <td>: {masterReimburseQuotaData.type.is_employee ? 'Employee' : 'Family'}</td>
          </tr>
          <tr>
            <td width="200">Family Status</td>
            <td>: {masterReimburseQuotaData.type.family_status || '-'}</td>
          </tr>
        </table>
      </div>
      <DataGridComponent
        columns={columns}
        url={{
          url: LIST_API_DETAIL_REIMBURSE_QUOTA(masterReimburseQuotaData.id),
        }}
        labelFilter='search'
      />
    </>
  );
};

Detail.layout = (page: ReactNode) => (
  <MainLayout title='Detail Reimburse Quota' description='Detail Reimburse Quota'>
    {page}
  </MainLayout>
);

export default Detail;
