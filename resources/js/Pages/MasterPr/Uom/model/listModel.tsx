import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'internal_uom', headerName: 'internal uom', width: 200, filterable: true },
  { field: 'iso_code', headerName: 'iso code', width: 200, filterable: true },
  { field: 'commercial', headerName: 'commercial', width: 200, filterable: true },
  {
    field: 'measurement_unit_text',
    headerName: 'measurement unit text',
    width: 200,
    filterable: true,
  },
  {
    field: 'unit_of_measurement_text',
    headerName: 'unit of measurement text',
    width: 200,
    filterable: true,
  },
];
