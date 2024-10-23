import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'request_number', headerName: 'Request Number', width: 200, filterable: true },
  { field: 'requester', headerName: 'Requester', width: 200, filterable: true },
  { field: 'remark', headerName: 'Remark', width: 200, filterable: true },
];

export interface Family {
  id: string;
  name: string;
  status: string;
  bod: string;
}

export interface Group {
  id: string;
  request_number: string;
  requester: User[];
  remark: string;
}

export interface Reimburse {
  id: string;
  remark: string;
  group: Group[];
  type: string;
  family: Family[];
  currency: string;
  balance: number;
  receipt_date: Date;
  start_date: Date;
  end_date: Date;
  period: string;
}

export interface User {
  id: string;
  nip: string;
  name: string;
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