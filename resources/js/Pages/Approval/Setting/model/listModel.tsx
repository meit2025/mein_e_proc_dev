import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'titel', headerName: 'Title Setting', width: 200, filterable: true },
  { field: 'key', headerName: 'Key  Setting', width: 200, filterable: true },
  { field: 'value', headerName: 'value  Setting', width: 200, filterable: true },
  { field: 'is_active', headerName: 'Active', width: 200, filterable: true },
];
