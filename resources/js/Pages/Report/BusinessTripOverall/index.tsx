import { CustomDialog } from '@/components/commons/CustomDialog';
import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_API_BUSINESS_TRIP, GET_LIST_BUSINESS_TRIP } from '@/endpoint/business-trip/api';
import { DETAIL_PAGE_BUSINESS_TRIP } from '@/endpoint/business-trip/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import React, { ReactNode } from 'react';
import { BussinessTripFormV1 } from './components/BussinessTripFormV1';
import {
    BusinessTripType,
    columns,
    Costcenter,
    Pajak,
    PurchasingGroup,
    UserModel,
} from './models/models';
import { REPORT_BT_OVERALL_EXPORT, REPORT_BT_OVERALL_LIST } from '@/endpoint/report/api';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
interface propsType {
    users: UserModel[];
    pajak: Pajak[];
    costcenter: Costcenter[];
    types: any[];
    listPurposeType: any[];
    listDestination: any[];
    departments: any[];
}

interface UserAuth {
    id: number;
    name: string;
    email: string;
    role: string;
    role_id: string;
}

interface SharedProps {
    auth: {
        user: UserAuth | null;
    };
}

const roleAkses = 'report business trip';

export const Index = ({
    users,
    pajak,
    costcenter,
    types,
    listPurposeType,
    listDestination,
    departments,

}: propsType) => {
    const [openForm, setOpenForm] = React.useState<boolean>(false);

    const [businessTripForm, setBusinessTripForm] = React.useState({
        type: BusinessTripType.create,
        id: undefined,
    });

    // Filter states
    const [startDate, setStartDate] = React.useState<string | null>(null);
    const [endDate, setEndDate] = React.useState<string | null>(null);
    const [status, setStatus] = React.useState<string>('');
    const [type, setType] = React.useState<string>('');
    const [destination, setDestination] = React.useState<string>('');
    const [department, setDepartment] = React.useState<string>('');

    function openFormHandler() {
        setOpenForm(!openForm);
    }

    const { auth } = usePage().props as unknown as SharedProps;

    const { showToast } = useAlert();

    const exporter = async (data: string) => {
        try {
            console.log(data);

            // Kirim permintaan ke endpoint dengan filter
            const response = await axiosInstance.get(REPORT_BT_OVERALL_EXPORT + data, {
                responseType: "blob"
            });

            console.log(response);


            // Membuat file dari respons
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Business_Trip_Request_Report.xlsx'); // Nama file
            document.body.appendChild(link);
            link.click();

            showToast('File berhasil diekspor!', 'success');
        } catch (error: any) {
            showToast(
                error.response?.data?.message || 'Terjadi kesalahan saat ekspor.',
                'error'
            );
        }
    };

    return (
        <>
            <div className='flex md:mb-4 mb-2 w-full'>
                {/* Filters */}
                <div className='flex gap-4 mb-4'>
                    <div>
                        <label htmlFor='start-date' className='block mb-1'>Start Date</label>
                        <input
                            type='date'
                            value={startDate || ''}
                            onChange={(e) => setStartDate(e.target.value)}
                            className='input-class'
                            placeholder='Start Date'
                        />
                    </div>
                    <div>
                        <label htmlFor='end-date' className='block mb-1'>End Date</label>
                        <input
                            type='date'
                            value={endDate || ''}
                            onChange={(e) => setEndDate(e.target.value)}
                            className='input-class'
                            placeholder='End Date'
                        />
                    </div>
                    <div>
                        <label htmlFor='end-date' className='block mb-1'>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className='select-class'>
                            <option value=''>All Status</option>
                            <option value='waiting_approve'>Waiting Approve</option>
                            <option value='cancel'>Cancel</option>
                            <option value='approve_to'>Approved</option>
                            <option value='reject_to'>Rejected</option>
                            <option value='fully_approve'>Fully Approved</option>
                            <option value='revise'>Revise</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor='type' className='block mb-1'>Purpose Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="select-class"
                            id="type"
                        >
                            <option value="">All Types</option>
                            {listPurposeType.map((typeOption) => (
                                <option
                                    key={typeOption.id}
                                    value={typeOption.id}
                                >
                                    {typeOption.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='destination' className='block mb-1'>Destination</label>
                        <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="select-class"
                            id="destination"
                        >
                            <option value="">All Destination</option>
                            {listDestination.map((typeOption) => (
                                <option
                                    key={typeOption.id}
                                    value={typeOption.id}
                                >
                                    {typeOption.destination}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='end-date' className='block mb-1'>Department</label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="select-class"
                            id="department"
                        >
                            <option value="">All Department</option>
                            {departments.map((dept) => (
                                <option
                                    key={dept.id}
                                    value={dept.id}
                                >
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <DataGridComponent
                isHistory={false}
                onExportXls={async (x: string) => await exporter(x)}
                defaultSearch={`?startDate=${startDate || ''}&endDate=${endDate || ''}&status=${status || ''}&type=${type || ''}&destination=${destination || ''}&department=${department || ''}&`}
                columns={columns}
                url={{
                    url: REPORT_BT_OVERALL_LIST,
                    detailUrl: DETAIL_PAGE_BUSINESS_TRIP,
                }}
                labelFilter='search'
            />
        </>
    );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
    <MainLayout title='Report' description='Business Trip Overall'>
        {page}
    </MainLayout>
);

export default Index;
