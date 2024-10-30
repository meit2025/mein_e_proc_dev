import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Code', width: 200, filterable: true },
  { field: 'name', headerName: 'Name', width: 200, filterable: true },
  { field: 'is_employee', headerName: 'Is for Employee', width: 200, filterable: true },
  { field: 'material_group', headerName: 'Material Group', width: 200, filterable: true },
  { field: 'material_number', headerName: 'Material Number', width: 200, filterable: true },
];

export interface ListTypeModel {
  code: string;
  name: string;
  is_employee: boolean;
  material_group: string;
  material_number: string;
}
