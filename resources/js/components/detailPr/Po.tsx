import * as React from 'react';
import DataGridComponent from '../commons/DataGrid';
import { columns } from './model/polist';
import { GET_PO_SAP } from '@/endpoint/purchaseRequisition/api';

interface PrProps {
  id: number;
  type: string;
}

const Po = (props?: PrProps) => {
  return (
    <>
      <DataGridComponent
        columns={columns}
        defaultSearch={`?data_id=${props?.id}&type_code_transaction=${props?.type}&`}
        url={{
          url: GET_PO_SAP,
        }}
        onExport={() => {
          console.log('x');
        }}
        labelFilter='search'
      />
    </>
  );
};

export default Po;
