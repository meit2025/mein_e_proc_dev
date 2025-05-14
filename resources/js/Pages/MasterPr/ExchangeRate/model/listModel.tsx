import {
    GridColDef
} from '@mui/x-data-grid';

export const columns: GridColDef[] = [{
        field: 'worklist',
        headerName: 'Worklist',
        width: 100,
        filterable: true
    },
    {
        field: 'er',
        headerName: 'Er',
        width: 50,
        filterable: true
    },
    {
        field: 'from',
        headerName: 'From',
        width: 100,
        filterable: true
    },
    {
        field: 'to',
        headerName: 'To',
        width: 100,
        filterable: true
    },
    {
        field: 'created_at',
        headerName: 'Rate',
        width: 200,
        filterable: false,
        renderCell: (params: any) => {
            return `${params.row.from}/${params.row.to}`
        }
    },
    { field: 'relation', headerName: 'Relation', width: 200, filterable: true },
    { field: 'last_date', headerName: 'Date of Last ExRte', width: 200, filterable: true,
      renderCell: (params:any) => {
        const date = new Date(params.value);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        return formattedDate;
      }
    },
    { field: 'old_er', headerName: 'Old Er', width: 200, filterable: true },
    { field: 'tolerance', headerName: 'Tolerance', width: 200, filterable: true },
];
