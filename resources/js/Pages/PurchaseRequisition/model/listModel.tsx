import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';
export const columns: GridColDef[] = [
  { field: 'document_type', headerName: 'document type', width: 200, filterable: true },
  {
    field: 'purchasing_groups',
    headerName: 'purchasing groups',
    width: 200,
    filterable: true,
  },
  {
    field: 'account_assignment_categories',
    headerName: 'account assignment categories',
    width: 200,
    filterable: true,
  },
  {
    field: 'delivery_date',
    headerName: 'delivery date',
    width: 200,
    filterable: true,
  },
  {
    field: 'storage_locations',
    headerName: 'storage locations',
    width: 200,
    filterable: true,
  },
  {
    field: 'total_vendor',
    headerName: 'total vendor',
    width: 200,
    filterable: true,
  },
  {
    field: 'total_item',
    headerName: 'total item',
    width: 200,
    filterable: true,
  },
];
