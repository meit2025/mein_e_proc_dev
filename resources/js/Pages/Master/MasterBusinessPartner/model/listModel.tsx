import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  {
    field: 'external_partner_number',
    headerName: 'external partner number',
    width: 200,
    filterable: true,
  },
  { field: 'search_term_one', headerName: 'search term 1', width: 200, filterable: true },
  { field: 'name_one', headerName: 'name 1', width: 200, filterable: true },
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
  { field: 'city', headerName: 'city', width: 200, filterable: true },
  { field: 'country', headerName: 'country', width: 200, filterable: true },
  { field: 'postal_code', headerName: 'postal code', width: 200, filterable: true },
  { field: 'tax_number', headerName: 'tax number', width: 200, filterable: true },
  { field: 'purchasing_block', headerName: 'purchasing block', width: 200, filterable: true },
  { field: 'type', headerName: 'type', width: 200, filterable: true },
];
