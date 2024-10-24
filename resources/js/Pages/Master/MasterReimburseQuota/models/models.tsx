import { GridColDef } from '@mui/x-data-grid';
import { ListPeriodModel } from '../../MasterReimbursePeriod/models/models';
import { ListTypeModel } from '../../MasterReimburseType/models/models';
import { BusinessTripGrade } from '@/Pages/BusinessTrip/BusinessGrade/model/model';

export const columns: GridColDef[] = [
  { field: 'period', headerName: 'Period', width: 200, filterable: true },
  { field: 'type', headerName: 'Type', width: 200, filterable: true },
  { field: 'grade', headerName: 'Grade', width: 200, filterable: true },
  { field: 'limit', headerName: 'Limit', width: 200, filterable: true },
  { field: 'plafon', headerName: 'Plafon', width: 200, filterable: true },
];

export interface ListTypeModel {
  period: ListPeriodModel[];
  type: ListTypeModel[];
  grade: BusinessTripGrade[];
  limit: Number;
  plafon: Number;
}