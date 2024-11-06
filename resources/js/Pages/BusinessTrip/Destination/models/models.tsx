import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'code', headerName: 'Destination Code', width: 200, filterable: true },
  { field: 'destination', headerName: 'Destination Name', width: 200, filterable: true },
  { field: 'type', headerName: 'Destination Type', width: 200, filterable: true },
];

export interface DestinationModel {
  id?: string;
  code?: string;
  destination?: string;
  type: string;
}
