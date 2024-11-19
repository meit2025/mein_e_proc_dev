import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  {
    field: 'declaration_no',
    headerName: 'Declaration Number',
    width: 200,
    filterable: true,
    renderCell: (params) => (
      <span
        onClick={() => handlePrintDetail(params.row.id)}
        style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
      >
        {params.value}
      </span>
    ),
  },
  { field: 'request_no', headerName: 'Request Number', width: 200, filterable: true },
  { field: 'request_for', headerName: 'Request For', width: 200, filterable: true },
  { field: 'created_at', headerName: 'Request Date', width: 200, filterable: true },
  { field: 'remarks', headerName: 'Remark', width: 200, filterable: true },
];

// Fungsi untuk menangani aksi cetak detail
const handlePrintDetail = (id: string) => {
  const printUrl = `/business-trip-declaration/print/${id}`;
  window.open(printUrl, '_blank');
};

export interface CurrencyModel {
  code: string;
  name: string;
}

export interface UserModel {
  name: string;
  id: string;
  nip: string;
}

export interface BusinessTripModel {
  id: string;
  request_no: string;
  user_id: string;
  purpose_type_id: string;
  name_request: any;
  name_purpose: any;
  total_destination: number;
  remark: string;
  attachment: string;
}

export interface AllowanceItemModel {
  code: string;
  name: string;
  purpose_type?: [];
  currency_id: string;
  request_value: string;
  formula: string;
  type: string;
  max_value?: string;
  fixed_value?: string;
  allowance_category_id: number;
}

export enum BusinessTripType {
  create,
  edit,
  update,
}
