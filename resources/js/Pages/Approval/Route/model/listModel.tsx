import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'group_id', headerName: 'Group Id', width: 200, filterable: true },
  {
    field: 'is_hr',
    headerName: 'Approval Hr',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      return <StatusBolean name={params.row.status?.name} status={params.row.is_hr} />;
    },
  },
  {
    field: 'is_bt',
    headerName: 'Business Trip',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      return <StatusBolean name={params.row.status?.name} status={params.row.is_bt} />;
    },
  },
  {
    field: 'is_reim',
    headerName: 'Reimbursement',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      return <StatusBolean name={params.row.status?.name} status={params.row.is_reim} />;
    },
  },
  {
    field: 'is_conditional',
    headerName: 'Approval Conditional',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      return <StatusBolean name={params.row.status?.name} status={params.row.is_conditional} />;
    },
  },
  {
    field: 'type_approval_conditional',
    headerName: 'Approval Conditional',
    width: 200,
    filterable: true,
  },
  {
    field: 'is_restricted_area',
    headerName: 'Restricted Area',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      return <StatusBolean name={params.row.status?.name} status={params.row.is_conditional} />;
    },
  },
  { field: 'nominal', headerName: 'Nominal Conditional', width: 200, filterable: true },
  { field: 'day', headerName: 'Day Conditional', width: 200, filterable: true },
];
