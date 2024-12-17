import { CustomStatus } from '@/components/commons/CustomStatus';
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

  {
    field: 'status',
    headerName: 'Status',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      return (
        <CustomStatus
          name={params.row.status?.name}
          className={params.row.status?.classname}
          code={params.row.status?.code}
        />
      );
    },
  },
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

export interface PajakModel {
  id: string;
  mwszkz: string;
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
  pajak_id: string;
  cost_center_id: string;
  purchasing_group_id: string;
  pajak?: PajakModel[];
  cost_center: [];
  purchasing_group: [];
  business_trip_destination: [];
  request_for?: RequestFor;
}

export interface RequestFor {
  id: number;
  nip: string;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  username: string;
  is_admin: string;
  master_business_partner_id: any;
  role_id: any;
  division_id: any;
  position_id: any;
  departement_id: any;
  is_approval: boolean;
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
