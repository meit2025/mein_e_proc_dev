import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'account', headerName: 'Account', filterable: true },
  { field: 'account_long_text', headerName: 'Account Long Text', filterable: true },
];
