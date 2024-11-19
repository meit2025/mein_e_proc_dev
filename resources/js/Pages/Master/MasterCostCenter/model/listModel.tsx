import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'controlling_area', headerName: 'Controlling area', width: 200, filterable: true },
  { field: 'controlling_name', headerName: 'Controlling name', width: 200, filterable: true },
  { field: 'cost_center', headerName: 'Cost center', width: 200, filterable: true },
  {
    field: 'valid_form',
    headerName: 'Valid form',
    width: 200,
    filterable: true,
  },
  { field: 'valid_to', headerName: 'Valid to', width: 200, filterable: true },
  { field: 'company_code', headerName: 'Company code', width: 200, filterable: true },
  { field: 'company_name', headerName: 'Company name', width: 200, filterable: true },
];
