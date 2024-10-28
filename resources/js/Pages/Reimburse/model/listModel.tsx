import { FamilyModel } from '@/Pages/Master/Family/models/models';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Request Number', width: 200, filterable: true },
  { field: 'requester', headerName: 'Request For', width: 200, filterable: true },
  { field: 'balance', headerName: 'Remark', width: 200, filterable: true },
  { field: 'sum_form', headerName: 'Form', width: 200, filterable: true },
  { field: 'sum_balance', headerName: 'Balance', width: 200, filterable: true },
  { field: 'status', headerName: 'Status', width: 200, filterable: true },
];

export interface Quota {
  id: string;
  user: User[];
  period: Period[];
  type: Type[];
  limit: number;
  plafon: number;
}

export interface Family {
  id: string;
  name: string;
  status: string;
  bod: string;
}

export interface Reimburse {
  id: string;
  remark: string;
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
  nip: string;
  name: string;
}

export interface Group {
  id: string;
  code: string;
  remark: string;
  status: string;
  users: User;
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
