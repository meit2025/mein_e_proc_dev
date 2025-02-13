import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Code', width: 200, filterable: true },
  { field: 'name', headerName: 'Currency Name', width: 200, filterable: true },
];
