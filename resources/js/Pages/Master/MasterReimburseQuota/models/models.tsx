import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'period', headerName: 'Period', width: 200, filterable: true },
  { field: 'type', headerName: 'Type', width: 200, filterable: true },
  { field: 'user', headerName: 'User', width: 200, filterable: true },
];

export interface User {
  id: string;
  nip: string;
  name: string;
}