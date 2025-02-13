import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Country Code', width: 200, filterable: true },
  { field: 'name', headerName: 'Country', width: 200, filterable: true },
];
