import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Item Code', width: 200, filterable: true },
  { field: 'name', headerName: 'Item Name', width: 200, filterable: true },
  { field: 'category', headerName: 'Category', width: 200, filterable: true },
  { field: 'purpose_type', headerName: 'Purpose Type', width: 200, filterable: true },
  { field: 'type', headerName: 'Type', width: 200, filterable: true },
  { field: 'grades', headerName: 'Grades', width: 200, filterable: true },
  { field: 'grade_option', headerName: 'Grade Option', width: 200, filterable: true },

  { field: 'currency', headerName: 'Currency', width: 200, filterable: true },
];



export interface CurrencyModel {
    code: string,
    name: string
}

export interface AllowanceItemModel {
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