import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  {
    field: 'request_no',
    headerName: 'Request No.',
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
  { field: 'purpose_type', headerName: 'Purpose Type', width: 200, filterable: true },
  { field: 'total_destination', headerName: 'Total Destinations', width: 200, filterable: true },

  { field: 'created_at', headerName: 'Total Destinations', width: 200, filterable: true },
];

// Fungsi untuk menangani aksi cetak detail
const handlePrintDetail = (id: string) => {
  const printUrl = `/business-trip/print/${id}`;
  window.open(printUrl, '_blank');
};

export interface CurrencyModel {
  code: string;
  name: string;
}

export interface BusinessTripModel {
  request_no: string;
  id: string;
}

export interface UserModel {
  name: string;
  id: string;
  nip: string;
}

export interface AllowanceItemModel {
  id: string;
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

export interface Pajak {
  mwszkz: string;
  id: string;
}

export interface Costcenter {
  cost_center: string;
  controlling_name: string;
  id: string;
}

export interface PurchasingGroup {
  purchasing_group: string;
  id: string;
}

export enum BusinessTripType {
  create,
  edit,
  update,
}

//  'type',
//    'fixed_value',
//    'max_value',
//    'request_value',
//    'formula',
//    'currency_id',
//    'allowance_category_id',
//    'code',
//    'name';
