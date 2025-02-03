import { CustomStatus } from '@/components/commons/CustomStatus';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import { GridColDef } from '@mui/x-data-grid';
import { ListLayout } from '../components/List';

export const columns = (isEmployee: any) : GridColDef[] => {
  return [
    { field: 'name', headerName: 'Reimbursement Type', width: 200, filterable: true },
    ...(isEmployee == 0 ? [
      {
        field: 'family_status',
        headerName: 'Relation',
        width: 200,
        filterable: true,
        renderCell: (params: any) => {
          return params.row.family_status;
        },
      },
    ] : []),
    { field: 'interval_claim_period', headerName: 'Interval Claim', width: 200, filterable: true },
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
    ...(isEmployee == 1 ? [
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
      },
    ] : []),
  ];
}

export const familyBalanceColumns : GridColDef[] = [
  { field: 'familyName', headerName: 'Name', width: 200, filterable: true },
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
  },
];

const handlePrintDetail = (id: string) => {
  const printUrl = `/reimburse/print/${id}`;
  window.open(printUrl, '_blank');
};

export const labelsTabs = ['My Reimbursement', 'Family Reimbursement'];
export const contentsTabs = () => {
  return [
    <ListLayout key='My Reimbursement' isEmployee={1} />,
    <ListLayout key='Family Reimbursement' isEmployee={0} />
  ];
};

