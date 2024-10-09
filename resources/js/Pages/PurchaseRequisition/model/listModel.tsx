import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'pr_number', headerName: 'Purchase Requisition Number', width: 200, filterable: true },
  { field: 'item_number', headerName: 'Item Number', width: 200, filterable: true },
  { field: 'requirement_tracking_number', headerName: 'Requirement Tracking Number', width: 200, filterable: true },
];
