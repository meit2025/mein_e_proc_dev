import { StatusBolean } from '@/Components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'key', headerName: 'Key', width: 200, filterable: true },
  { field: 'secret_key', headerName: 'Secret Key', width: 200, filterable: true },
  { field: 'employee', headerName: 'Employee', width: 200, filterable: true },
  { field: 'desc', headerName: 'Description', width: 200, filterable: true },
  {
    filterable: false,
    field: 'is_status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => {
      return <StatusBolean status={params.value as boolean} />;
    },
  },
];
