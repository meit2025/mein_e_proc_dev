import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Category Code', width: 200, filterable: true },
  { field: 'name', headerName: 'Category Name', width: 200, filterable: true },
];

export interface AllowanceCategoryModel {
  id: number;
  code: string;
  name: string;
}
