import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'group_id', headerName: 'Group Id', width: 200, filterable: true },
  { field: 'is_hr', headerName: 'Approval Hr', width: 200, filterable: true },
  { field: 'is_conditional', headerName: 'Approval Conditional', width: 200, filterable: true },
  { field: 'nominal', headerName: 'Nominal Conditional', width: 200, filterable: true },
];
