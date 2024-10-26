import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'desimal', headerName: 'desimal', width: 200, filterable: true },
  { field: 'mwszkz', headerName: 'Code Tax', width: 200, filterable: true },
  { field: 'description', headerName: 'Description', width: 200, filterable: true },
];
