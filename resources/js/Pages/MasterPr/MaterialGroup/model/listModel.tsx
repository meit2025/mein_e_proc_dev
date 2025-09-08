import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'material_group', headerName: 'Material Group', width: 200, filterable: true },
  { field: 'material_group_desc', headerName: 'description', width: 200, filterable: true },
];
