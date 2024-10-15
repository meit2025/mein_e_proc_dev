import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';
export const columns: GridColDef[] = [
  { field: 'const_center', headerName: 'const center', width: 200, filterable: true },
  {
    field: 'cost_center_budgeted',
    headerName: 'const center budgeted ',
    width: 200,
    filterable: true,
  },
  {
    field: 'vendor_remark',
    headerName: 'vendor remark',
    width: 200,
    filterable: true,
  },
  {
    field: 'selected_vendor_remark',
    headerName: 'selected vendor remark',
    width: 200,
    filterable: true,
  },
];
