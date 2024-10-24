import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'request_no', headerName: 'Request No.', width: 200, filterable: true },
  { field: 'purpose_type', headerName: 'Purpose Type', width: 200, filterable: true },
  { field: 'total_destination', headerName: 'Total Destinations', width: 200, filterable: true },
];

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
