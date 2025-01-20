import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nama', width: 200, filterable: true },
  { field: 'nip', headerName: 'NIP', width: 300, filterable: true },
  { field: 'grade', headerName: 'Grade', width: 100, filterable: false },
  {
    field: 'balancePlafon',
    headerName: 'Maximum Balance',
    width: 200,
    filterable: true,
    renderCell: (params: any) => {
      return formatRupiah(params.row.balancePlafon);
    },
  },
];