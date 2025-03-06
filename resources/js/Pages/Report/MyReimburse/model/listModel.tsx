import { CustomStatus } from '@/components/commons/CustomStatus';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import { GridColDef } from '@mui/x-data-grid';
import { ListLayout } from '../components/List';

export const columns: GridColDef[] = [
  { field: 'reimburse_type_name', headerName: 'Reimbursement Type', width: 200, filterable: true },
  {
    field: 'is_employee',
    headerName: 'For',
    width: 200,
    filterable: false,
    sortable: false,
    renderCell: (params: any) => {
      return params.value == 1 ? 'Employee' : 'Family ('+params.row.family_status+')';
    },
  },
  { field: 'user_name', headerName: 'Employee Name', width: 200, filterable: true },
  { field: 'familiy_name', headerName: 'Family Name', width: 200, filterable: true },
  { field: 'currency', headerName: 'Currency', width: 100, filterable: false, sortable: false, },
  {
    field: 'maximumBalance',
    headerName: 'Maximum Balance',
    width: 200,
    filterable: false,
    sortable: false,
    renderCell: (params: any) => {
      return formatRupiah(params.row.maximumBalance);
    },
  },
  {
    field: 'totalPaid',
    headerName: 'Total Rembursement Paid',
    width: 200,
    filterable: false,
    sortable: false,
    renderCell: (params: any) => {
      return formatRupiah(params.row.totalPaid);
    },
  },
  {
    field: 'totalUnpaid',
    headerName: 'Total Rembursement Unpaid',
    width: 200,
    filterable: false,
    sortable: false,
    renderCell: (params: any) => {
      return formatRupiah(params.row.totalUnpaid);
    },
  },
  {
    field: 'remainingBalance',
    headerName: 'Remaining Balance',
    width: 200,
    filterable: false,
    sortable: false,
    renderCell: (params: any) => {
      return formatRupiah(params.row.remainingBalance);
    },
  },
  {
    field: 'lastClaimDate',
    headerName: 'Last Claim Date',
    width: 200,
    filterable: false,
    sortable: false,
    renderCell: (params: any) => {
      if (params.row.lastClaimDate !== null) {
        const date = new Date(params.row.lastClaimDate);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      } else {
        return '-';
      }
    },
  },
  {
    field: 'availableClaimDate',
    headerName: 'Available Claim Date',
    width: 200,
    filterable: false,
    sortable: false,
    renderCell: (params: any) => {
      if (params.row.availableClaimDate !== null) {
        const date = new Date(params.row.availableClaimDate);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      } else {
        return '-';
      }
    },
  }
];

