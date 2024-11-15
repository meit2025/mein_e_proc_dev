import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Code', width: 200, filterable: true },
  { field: 'start', headerName: 'Start Date', width: 200, filterable: true },
  { field: 'end', headerName: 'End Date', width: 200, filterable: true },
];

export interface ListPeriodModel {
  code: string;
  start: date;
  end: date;
}
