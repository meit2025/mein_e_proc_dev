import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'period', headerName: 'Period', width: 200, filterable: true },
  { field: 'type', headerName: 'Type', width: 200, filterable: true },
  { field: 'grade', headerName: 'Grade', width: 200, filterable: true },
  { field: 'limit', headerName: 'Limit', width: 200, filterable: true },
  { field: 'plafon', headerName: 'Plafon', width: 200, filterable: true },
];

export interface User {
  id: string;
  nip: string;
  name: string;
}