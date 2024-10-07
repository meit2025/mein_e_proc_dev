import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Item Code', width: 200, filterable: true },
  { field: 'name', headerName: 'Item Name', width: 200, filterable: true },
  { field: 'category', headerName: 'Category', width: 200, filterable: true },
  { field: 'purpose_type', headerName: 'Purpose Type', width: 200, filterable: true },
  { field: 'type', headerName: 'Type', width: 200, filterable: true },
  { field: 'currency', headerName: 'Currency', width: 200, filterable: true },
];



export interface CurrencyModel {
    code: string,
    name: string
}