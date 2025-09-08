import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  {
    field: 'document_type.purchasing_doc',
    headerName: 'Document Type',
    width: 200,
    renderCell: (params) => params.row.document_type?.purchasing_doc,
  },
  { field: 'dscription', headerName: 'Description', width: 200, filterable: true },
  {
    field: 'condition_type',
    headerName: 'Threshold',
    width: 200,
    renderCell: (params) =>
      params.row.condition_type === 'range'
        ? `${params.row.min_value} - ${params.row.max_value}`
        : `${params.row.condition_type ?? ''}  ${params.row.value === '0' ? '' : params.row.value}`,
  },
  {
    field: 'master_division.name',
    headerName: 'Division',
    width: 200,
    renderCell: (params) => params.row.master_division?.name,
  },
  {
    field: 'purchasing_group.purchasing_group',
    headerName: 'Purch Group',
    width: 200,
    renderCell: (params) => params.row.purchasing_group?.purchasing_group,
  },
  {
    field: 'master_tracking_number.name',
    headerName: 'Tracking Number',
    width: 200,
    renderCell: (params) => params.row.master_tracking_number?.name,
  },
];
