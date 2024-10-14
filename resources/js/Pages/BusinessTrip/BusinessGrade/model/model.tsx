import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'grade', headerName: "Grade", width: 200, filterable: true },
  // { field: 'name', headerName: 'Category Name', width: 200, filterable: true },
];


export interface BusinessTripGrade {
  id: number,
  grade: string,
}