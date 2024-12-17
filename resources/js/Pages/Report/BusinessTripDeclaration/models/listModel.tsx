import { CustomStatus } from '@/components/commons/CustomStatus';
import { StatusBolean } from '@/components/commons/StatusBolean';
import { GridColDef } from '@mui/x-data-grid';
export const columns: GridColDef[] = [
  { field: 'request_no', headerName: 'Request No.', width: 200, filterable: true },
  // { field: 'purpose_type', headerName: 'Purpose Type', width: 200, filterable: true },
  { field: 'total_destination', headerName: 'Total Destinations', width: 200, filterable: true },
  // {
  //   field: 'status',
  //   headerName: 'Status',
  //   width: 200,
  //   filterable: true,
  //   renderCell: (params: any) => {
  //     return (
  //       <CustomStatus
  //         name={params.row.status?.name}
  //         className={params.row.status?.classname}
  //         code={params.row.status?.code}
  //       />
  //     );
  //   },
  // },
];
