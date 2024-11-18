import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'plant', headerName: 'plant', width: 200, filterable: true },
  { field: 'storage_location', headerName: 'storage location', width: 200, filterable: true },
  {
    field: 'storage_location_desc',
    headerName: 'storage location desc',
    width: 200,
    filterable: true,
  },
];
