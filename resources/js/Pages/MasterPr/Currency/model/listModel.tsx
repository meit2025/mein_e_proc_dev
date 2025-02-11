import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Currency', width: 200, filterable: true },
  { field: 'name', headerName: 'Country Code', width: 200, filterable: true },
];
