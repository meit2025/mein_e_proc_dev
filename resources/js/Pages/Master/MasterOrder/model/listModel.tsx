import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'order_number', headerName: 'Order number', width: 200, filterable: true },
  { field: 'order_type', headerName: 'Order type', width: 200, filterable: true },
  { field: 'short text', headerName: 'Short text', width: 200, filterable: true },
  {
    field: 'Company code',
    headerName: 'Material description',
    width: 200,
    filterable: true,
  },
  { field: 'company_name', headerName: 'Company name', width: 200, filterable: true },
  { field: 'profile_center', headerName: 'Profile center', width: 200, filterable: true },
  { field: 'long_text', headerName: 'Long text', width: 200, filterable: true },
  { field: 'desc', headerName: 'desc', width: 200, filterable: true },
];
