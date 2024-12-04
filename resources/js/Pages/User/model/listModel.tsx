import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'nip', headerName: 'NIP', width: 200, filterable: true },
  { field: 'name', headerName: 'Name', width: 200, filterable: true },
  { field: 'email', headerName: 'Email', width: 200, filterable: true },
  {
    field: 'departements.name',
    headerName: 'Department',
    width: 200,
    filterable: true,
    renderCell: (params) => <span className='capitalize'>{params.row.departements?.name}</span>,
  },
  {
    field: 'divisions.name',
    headerName: 'Division',
    width: 200,
    filterable: true,
    renderCell: (params) => <span className='capitalize'>{params.row.divisions?.name}</span>,
  },
  {
    field: 'positions.name',
    headerName: 'Positions',
    width: 200,
    filterable: true,
    renderCell: (params) => <span className='capitalize'>{params.row.positions?.name}</span>,
  },
  {
    field: 'role.name',
    headerName: 'Role',
    width: 200,
    filterable: true,
    renderCell: (params) => <span className='capitalize'>{params.row.role?.name}</span>,
  },
];

export const columnsValue: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 300,
    filterable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 300,
    filterable: true,
  },
  {
    field: 'bod',
    headerName: 'Birth Of Day',
    width: 300,
    filterable: true,
  },
];
