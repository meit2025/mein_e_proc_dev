import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'account', headerName: 'name account', width: 200, filterable: true },
  { field: 'description', headerName: 'description', width: 200, filterable: true },
];
