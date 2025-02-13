import DataGridComponent from '@/components/commons/DataGrid';
import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';

import { CustomDialog } from '@/components/commons/CustomDialog';
import { BusinessTripType, columns, UserModel } from './models/models';

import {
    DELET_API,
    GET_LIST_BUSINESS_TRIP_DECLARATION,
} from '@/endpoint/business-trip-declaration/api';
import { DETAIL_PAGE_BUSINESS_TRIP_DECLARATION } from '@/endpoint/business-trip-declaration/page';
import { BussinessTripFormV1 } from './components/BussinessTripFormV1';
import { REPORT_BT_DEC_EXPORT, REPORT_BT_DEC_LIST } from '@/endpoint/report/api';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';

interface propsType {
    listPurposeType: any[];
    listDestination: any[];
    users: UserModel[];
    departments: any[];
    statuses: any[];
}
const roleAkses = 'business trip declaration';
export const Index = ({ listPurposeType, listDestination, users, departments, statuses }: propsType) => {
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

    const { showToast } = useAlert();

    const exporter = async (data: string) => {
        try {
            console.log(data);

            // Kirim permintaan ke endpoint dengan filter
            const response = await axiosInstance.get(REPORT_BT_DEC_EXPORT + data, {
                responseType: "blob"
            });

            // Membuat file dari respons
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Business_Trip_Declarations.xlsx'); // Nama file
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

    function openFormHandler() {
        setOpenForm(!openForm);
    }
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
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="select-class"
                            id="status"
                        >
                            <option value="">All Status</option>
                            {statuses.map((typeOption) => (
                                <option
                                    key={typeOption.code}
                                    value={typeOption.code}
                                >
                                    {typeOption.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='end-date' className='block mb-1'>Type</label>
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
                // onCreate={openFormHandler}
                onExportXls={async (x: string) => await exporter(x)}
                defaultSearch={`?startDate=${startDate || ''}&endDate=${endDate || ''}&status=${status || ''}&type=${type || ''}&destination=${destination || ''}&department=${department || ''}&`}
                columns={columns}
                url={{
                    url: REPORT_BT_DEC_LIST,
                    // deleteUrl: DELET_API,
                    detailUrl: DETAIL_PAGE_BUSINESS_TRIP_DECLARATION,
                }}
                labelFilter='search'
            />
        </>
    );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
    <MainLayout title='Report' description='Business Trip Declaration'>
        {page}
    </MainLayout>
);

export default Index;
