import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  {
    field: 'code_endpoint',
    headerName: 'endpoint',
    width: 300,
    filterable: true,
    renderCell: (params) => {
      return `${params.row.methods === 'post' ? '/api/allow?code_endpoint=' : '/api/allow-get?code_endpoint='}${params.value}`;
    },
  },
  { field: 'name', headerName: 'Name', width: 150, filterable: true },
  { field: 'tabel_name', headerName: 'tabel name', width: 150, filterable: true },
  { field: 'methods', headerName: 'methods', width: 100, filterable: true },
  { field: 'type', headerName: 'Type', width: 200, filterable: true },
  {
    filterable: false,
    field: 'is_status',
    headerName: 'Status',
    width: 100,
    renderCell: (params) => {
      return <StatusBolean status={params.value as boolean} />;
    },
  },
];

export const columnsValue: GridColDef[] = [
  {
    field: 'column_value',
    headerName: 'Column',
    width: 300,
    filterable: true,
  },
  { field: 'value', headerName: 'Parameter Value', width: 150, filterable: true },
  {
    filterable: false,
    field: 'is_key',
    headerName: 'key',
    width: 100,
  },
];
