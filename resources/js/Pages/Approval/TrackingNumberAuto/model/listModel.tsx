import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  {
    field: 'purchasing_group.purchasing_group',
    headerName: 'Purch Group',
    width: 200,
    renderCell: (params) => params.row.purchasing_group?.purchasing_group,
  },
  {
    field: 'master_tracking_number.name',
    headerName: 'Tracking Number',
    width: 200,
    renderCell: (params) => params.row.master_tracking_number?.name,
  },
];
