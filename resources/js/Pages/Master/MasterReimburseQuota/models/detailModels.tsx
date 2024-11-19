import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'employerName', headerName: 'Employer Name', width: 200, filterable: true },
  { field: 'familyName', headerName: 'Family Name', width: 200, filterable: true },
  { field: 'plafon', headerName: 'Plafon', width: 200, filterable: true },
  { field: 'grade', headerName: 'Grade', width: 200, filterable: true },
];
