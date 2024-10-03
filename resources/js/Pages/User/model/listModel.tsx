import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'nip', headerName: 'NIP', width: 200, filterable: true },
  { field: 'name', headerName: 'Name', width: 200, filterable: true },
  { field: 'email', headerName: 'Email', width: 200, filterable: true },
  {
    field: 'job_level',
    headerName: 'Job Level',
    width: 200,
    filterable: true,
  },
  {
    field: 'division',
    headerName: 'Division',
    width: 200,
    filterable: true,
  },
  { field: 'immediate_spv', headerName: 'Immediate SPV', width: 200, filterable: true },
  { field: 'role', headerName: 'Role', width: 200, filterable: true },
];
