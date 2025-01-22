import { GridColDef } from '@mui/x-data-grid';
import { CustomStatus } from '@/components/commons/CustomStatus';

export const columns: GridColDef[] = [
    { field: 'employee_no', headerName: 'Employee No', width: 200, filterable: true },
    { field: 'employee_name', headerName: 'Employee Name', width: 200, filterable: true },
    { field: 'position', headerName: 'Position', width: 200, filterable: true },
    { field: 'dept', headerName: 'Departement', width: 200, filterable: true },
    { field: 'division', headerName: 'Division', width: 200, filterable: true },

    {
        field: 'request_no',
        headerName: 'Request No.',
        width: 200,
        filterable: true,
    },
    { field: 'request_for', headerName: 'Request For', width: 200, filterable: true },
    { field: 'purpose_type', headerName: 'Purpose Type', width: 200, filterable: true },
    { field: 'remarks', headerName: 'Remarks', width: 200, filterable: true },
    { field: 'created_at', headerName: 'Request Date', width: 200, filterable: true },
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
    { field: 'total_destination', headerName: 'Total Destinations', width: 200, filterable: true },
];

// Fungsi untuk menangani aksi cetak detail
const handlePrintDetail = (id: string) => {
    const printUrl = `/business-trip/print/${id}`;
    window.open(printUrl, '_blank');
};

export interface CurrencyModel {
    code: string;
    name: string;
}

export interface BusinessTripModel {
    request_no: string;
    id: string;
}

export interface UserModel {
    name: string;
    id: string;
    nip: string;
}

export interface AllowanceItemModel {
    id: string;
    code: string;
    name: string;
    purpose_type?: [];
    currency_id: string;
    request_value: string;
    formula: string;
    type: string;
    max_value?: string;
    fixed_value?: string;
    allowance_category_id: number;
}

export interface Pajak {
    mwszkz: string;
    id: string;
}

export interface Costcenter {
    cost_center: string;
    controlling_name: string;
    id: string;
}

export interface PurchasingGroup {
    purchasing_group: string;
    id: string;
}

export enum BusinessTripType {
    create,
    edit,
    update,
}

//  'type',
//    'fixed_value',
//    'max_value',
//    'request_value',
//    'formula',
//    'currency_id',
//    'allowance_category_id',
//    'code',
//    'name';
