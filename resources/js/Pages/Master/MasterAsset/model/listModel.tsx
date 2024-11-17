import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'company_code', headerName: 'Company code', width: 200, filterable: true },
  { field: 'company_name', headerName: 'Company name', width: 200, filterable: true },
  { field: 'asset', headerName: 'Asset', width: 200, filterable: true },
  {
    field: 'asset_subnumber',
    headerName: 'Asset subnumber',
    width: 200,
    filterable: true,
  },
  {
    field: 'asset_class',
    headerName: 'Asset class',
    width: 200,
    filterable: true,
  },
  { field: 'inventory_number', headerName: 'Inventory number', width: 200, filterable: true },
  { field: 'qty', headerName: 'Qty', width: 200, filterable: true },
];
