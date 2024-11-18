import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'region_key', headerName: 'Region key', width: 200, filterable: true },
  { field: 'bank_keys', headerName: 'Bank keys', width: 200, filterable: true },
  {
    field: 'name_financial_institution',
    headerName: 'Financial institution',
    width: 200,
    filterable: true,
  },
  {
    field: 'city',
    headerName: 'City',
    width: 200,
    filterable: true,
  },
  { field: 'street_house_number', headerName: 'House number', width: 200, filterable: true },
  { field: 'bank_branch', headerName: 'Bank branch', width: 200, filterable: true },
];
