import { GridColDef } from '@mui/x-data-grid';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import { CustomStatus } from '@/components/commons/CustomStatus';

export const columns: GridColDef[] = [
  {
    field: 'username',
    headerName: 'Username',
    width: 200,
    filterable: true,
  },
  { field: 'nip', headerName: 'NIP', width: 200, filterable: true },
  { field: 'name', headerName: 'Name', width: 200, filterable: true },
  { field: 'email', headerName: 'Email', width: 200, filterable: true },
  {
    field: 'departements.name',
    headerName: 'Department',
    width: 200,
    filterable: true,
    renderCell: (params) => <span className='capitalize'>{params.row.departements?.name}</span>,
  },
  {
    field: 'divisions.name',
    headerName: 'Division',
    width: 200,
    filterable: true,
    renderCell: (params) => <span className='capitalize'>{params.row.divisions?.name}</span>,
  },
  {
    field: 'positions.name',
    headerName: 'Positions',
    width: 200,
    filterable: true,
    renderCell: (params) => <span className='capitalize'>{params.row.positions?.name}</span>,
  },

  {
    field: 'role.name',
    headerName: 'Role',
    width: 200,
    filterable: true,
    renderCell: (params) => <span className='capitalize'>{params.row.role?.name}</span>,
  },
];

export const columnsValue: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 300,
    filterable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 300,
    filterable: true,
  },
  {
    field: 'bod',
    headerName: 'Birth Of Day',
    width: 300,
    filterable: true,
  },
];

export const reimburseHistoryColumns: GridColDef[] = [
  {
    field: 'balance',
    headerName: 'Total Balance',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      return formatRupiah(params.row.balance);
    },
  },
  {
    field: 'claimDate',
    headerName: 'Claim Date',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      const date = new Date(params.row.claimDate);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      return formattedDate;
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      return (
        <CustomStatus
          name={params.row.status?.name}
          className={params.row.status?.classname}
          code={params.row.status?.code}
        />
      );
    },
  },
  {
    field: 'reimburseType',
    headerName: 'Reimburse Type',
    width: 300,
    filterable: true,
  },
  {
    field: 'purchasingGroup',
    headerName: 'Puschasing Group',
    width: 300,
    filterable: true,
  },
  {
    field: 'costCenter',
    headerName: 'Pusat Biaya',
    width: 300,
    filterable: true,
  },
  {
    field: 'uom',
    headerName: 'Unit Of Measure',
    width: 300,
    filterable: true,
  },
  {
    field: 'tax',
    headerName: 'Tax',
    width: 300,
    filterable: true,
  },
];
