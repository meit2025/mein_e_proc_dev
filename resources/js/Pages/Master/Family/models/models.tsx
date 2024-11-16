import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'user', headerName: 'Family Member of', width: 200, filterable: true },
  { field: 'name', headerName: 'Name', width: 200, filterable: true },
  { field: 'bod', headerName: 'Birth of Date', width: 200, filterable: true },
  { field: 'status', headerName: 'As', width: 200, filterable: true },
];

export interface FamilyModel {
  name: string;
  bod: Date;
  status: string;
  user: string;
}

export interface UserModel {
  nip: String;
  name: String;
  families: FamilyModel[];
}
