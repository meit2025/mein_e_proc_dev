import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'name', headerName: 'Valuation Type Name', width: 200, filterable: true },
];
