import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'request_no', headerName: 'Request No.', width: 200, filterable: true },
  { field: 'purpose_type', headerName: 'Purpose Type', width: 200, filterable: true },
  { field: 'total_destination', headerName: 'Total Destinations', width: 200, filterable: true },
];

export interface CurrencyModel {
    code: string,
    name: string
}

export interface BusinessTripModel {
    request_no: string,
    id: string,
}

export interface UserModel {
  name: string,
  id: string,
  nip:string
}

export interface AllowanceItemModel {
    id: string,
    code: string,
    name: string,
    purpose_type?: [],
    currency_id: string,
    request_value: string,
    formula:string,
    type:string,
    max_value?:string,
    fixed_value?:string,
    allowance_category_id:number,
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
