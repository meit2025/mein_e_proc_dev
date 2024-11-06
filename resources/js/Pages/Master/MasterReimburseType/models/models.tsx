import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Code', width: 200, filterable: true },
  { field: 'plafon', headerName: 'Plafon', width: 200, filterable: true },
  { field: 'is_employee', headerName: 'Status', width: 200, filterable: true },
  { field: 'material_group', headerName: 'Material Group', width: 200, filterable: true },
  { field: 'material_number', headerName: 'Material Number', width: 200, filterable: true },
];

export interface Grade {
  id: string;
  grade: string;
}

export interface ReimburseTypeModel {
  id: string;
  code: string;
}
