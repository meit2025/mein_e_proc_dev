import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'purchasing_doc', headerName: 'Document', width: 200, filterable: true },
  { field: 'purchasing_dsc', headerName: 'Description', width: 200, filterable: true },
];
