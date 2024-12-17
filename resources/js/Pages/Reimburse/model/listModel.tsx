import { CustomStatus } from '@/components/commons/CustomStatus';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'id', headerName: 'Request Number', width: 200, filterable: true },
  {
    field: 'code',
    headerName: 'Request Number',
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
  { field: 'request_for', headerName: 'Reimburse for', width: 200, filterable: true },
  { field: 'remark', headerName: 'Remark', width: 200, filterable: true },
  {
    field: 'balance',
    headerName: 'Total Balance',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      return formatRupiah(params.row.balance);
    },
  },
  { field: 'form', headerName: 'Reimburse Form', width: 200, filterable: true },
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
  {
    field: 'createdDate',
    headerName: 'Created Date',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      const date = new Date(params.row.createdDate);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      return formattedDate;
    },
  },
];

const handlePrintDetail = (id: string) => {
  const printUrl = `/reimburse/print/${id}`;
  window.open(printUrl, '_blank');
};

export interface Quota {
  id: string;
  user: User[];
  period: Period[];
  type: TypeReimburse[];
  limit: number;
  plafon: number;
}

export interface Tax {
  id: string;
  mwszkz: number;
}

export interface CostCenter {
  id: string;
  cost_center: string;
}

export interface TypeReimburse {
  code: string;
  name: string;
  is_employee: boolean;
  material_group: string;
  material_number: string;
}

export interface Family {
  id: string;
  name: string;
  status: string;
  bod: string;
}

export interface Reimburse {
  id: string;
  for: string;
  group: string;
  reimburse_type: string;
  short_text: string;
  balance: number;
  currency: string;
  tax_on_sales: string;
  purchasing_group: string;
  period: string;
  type: string;
  item_delivery_data: Date;
  start_date: Date;
  end_date: Date;
}

export interface User {
  nip: string;
  id: string;
  name: string;
  is_admin: number;
}

export interface Group {
  id: string;
  code: string;
  remark: string;
  status: string;
  cost_center: string;
  user: User;
  requester: string;
  status_id: number;
  reimburses: Reimburse[];
}

export interface Currency {
  code: string;
  name: string;
}

export interface Period {
  id: string;
  code: string;
  start: string;
  end: string;
}

export interface PurchasingGroup {
  id: string;
  purchasing_group: string;
  purchasing_group_desc: string;
}
