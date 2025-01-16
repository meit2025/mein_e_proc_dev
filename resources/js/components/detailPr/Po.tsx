import * as React from 'react';
import DataGridComponent from '../commons/DataGrid';
import { columns } from './model/polist';
import { GET_PO_SAP, SEND_PO_SAP } from '@/endpoint/purchaseRequisition/api';
import axiosInstance from '@/axiosInstance';
import { useAlert } from '@/contexts/AlertContext';

interface PrProps {
  id: number;
  type: string;
}

const Po = (props?: PrProps) => {
  const { showToast } = useAlert();
  const sendSap = async () => {
    // Make this function async
    const id = props?.id ?? '';
    const type = props?.type ?? '';
    try {
      const response = await axiosInstance.get(SEND_PO_SAP(id, type));
      showToast(response.data.message ?? 'success', 'success');
    } catch (error: any) {
      showToast(error.response.data.message, 'error');
    }
  };
  return (
    <>
      <DataGridComponent
        columns={columns}
        defaultSearch={`?data_id=${props?.id}&type_code_transaction=${props?.type}&`}
        url={{
          url: GET_PO_SAP,
        }}
        onExport={async () => {
          await sendSap();
        }}
        labelFilter='search'
      />
    </>
  );
};

export default Po;
