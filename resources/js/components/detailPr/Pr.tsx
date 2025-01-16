import * as React from 'react';
import DataGridComponent from '../commons/DataGrid';
import { columns } from './model/prlist';
import { GET_PR_SAP, SEND_PR_SAP } from '@/endpoint/purchaseRequisition/api';
import axiosInstance from '@/axiosInstance';
import { useAlert } from '@/contexts/AlertContext';

interface PrProps {
  id: number;
  type: string;
}

const Pr: React.FC<PrProps> = (props) => {
  const { showToast } = useAlert();

  const sendSap = async () => {
    const id = props.id ?? '';
    const type = props.type ?? '';
    try {
      const response = await axiosInstance.get(SEND_PR_SAP(id, type));
      showToast(response.data.message ?? 'success', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'An error occurred', 'error');
    }
  };

  return (
    <>
      <DataGridComponent
        columns={columns}
        defaultSearch={`?data_id=${props.id}&type_code_transaction=${props.type}&`}
        url={{
          url: GET_PR_SAP,
        }}
        onExport={async () => {
          await sendSap(); // This will work asynchronously when the onExport function is triggered
        }}
        labelFilter='search'
      />
    </>
  );
};

export default Pr;
