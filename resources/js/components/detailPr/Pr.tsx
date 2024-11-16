import * as React from 'react';
import DataGridComponent from '../commons/DataGrid';
import { columns } from './model/prlist';
import { GET_PR_SAP } from '@/endpoint/purchaseRequisition/api';

interface PrProps {
  id: number;
  type: string;
}

const Pr = (props?: PrProps) => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        defaultSearch={`?data_id=${props?.id}&type_code_transaction=${props?.type}&`}
        url={{
          url: GET_PR_SAP,
        }}
        onExport={() => {
          console.log('x');
        }}
        labelFilter='search'
      />
    </>
  );
};

export default Pr;
