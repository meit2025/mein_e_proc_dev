import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Purpose Type Code', width: 200, filterable: true },
  { field: 'name', headerName: 'Purpose Type Name', width: 200, filterable: true },
  { field: 'allowances', headerName: 'Allowances', width: 200, filterable: true },
];





export interface PurposeTypeModel {
  code: string,
  name:string,
  attedance_status: string,
  id: string,
}