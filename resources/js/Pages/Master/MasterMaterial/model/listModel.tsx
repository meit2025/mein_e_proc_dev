import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'material_group', headerName: 'Material group', width: 200, filterable: true },
  { field: 'material_number', headerName: 'Material number', width: 200, filterable: true },
  { field: 'material_type', headerName: 'Material type', width: 200, filterable: true },
  {
    field: 'material_description',
    headerName: 'Material description',
    width: 200,
    filterable: true,
  },
  { field: 'industry', headerName: 'Industry', width: 200, filterable: true },
  { field: 'old_material_number', headerName: 'Old material number', width: 200, filterable: true },
];
