import * as React from 'react';
import DataGridComponent from '../commons/DataGrid';
import { columns } from './model/dplist';
import { GET_DP_SAP } from '@/endpoint/purchaseRequisition/api';

interface PrProps {
  id: number;
  type: string;
}

const Dp = (props?: PrProps) => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        defaultSearch={`?data_id=${props?.id}&type_code_transaction=${props?.type}&`}
        url={{
          url: GET_DP_SAP,
        }}
        onExport={() => {
          console.log('x');
        }}
        labelFilter='search'
      />
    </>
  );
};

export default Dp;
