import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'purchasing_group', headerName: 'purchasing group', width: 200, filterable: true },
  {
    field: 'purchasing_group_desc',
    headerName: 'purchasing group description',
    width: 200,
    filterable: true,
  },
];
