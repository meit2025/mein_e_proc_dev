import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  {
    field: 'external_partner_number',
    headerName: 'external partner number',
    width: 200,
    filterable: true,
  },
  { field: 'bank_keys', headerName: 'Bank keys', width: 200, filterable: true },
  {
    field: 'partner_grouping',
    headerName: 'partner grouping',
    width: 200,
    filterable: true,
  },
  {
    field: 'partner_number',
    headerName: 'partner number',
    width: 200,
    filterable: true,
  },
  { field: 'central_block', headerName: 'central block', width: 200, filterable: true },
];
