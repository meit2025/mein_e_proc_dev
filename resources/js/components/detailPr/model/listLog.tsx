import { GridColDef } from '@mui/x-data-grid';

export const columnsLogs: GridColDef[] = [
  {
    field: 'level',
    headerName: 'Level',
    width: 100,
    filterable: true,
  },
  { field: 'message', headerName: 'Message', width: 150, filterable: true },
  {
    filterable: true,
    field: 'context',
    headerName: 'json value',
    width: 400,
  },
  {
    filterable: false,
    field: 'created_at',
    headerName: 'Time Hit',
    width: 100,
    renderCell: (params) => {
      const date = new Date(params.value);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      return <span>{formattedDate}</span>;
    },
  },
];
