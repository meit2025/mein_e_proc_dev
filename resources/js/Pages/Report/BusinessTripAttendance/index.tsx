import DataGridComponent from '@/components/commons/DataGrid';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import React, { ReactNode, useState, useEffect } from 'react';
import {columns} from './models/models';
import { REPORT_BT_ATTENDANCE_EXPORT, REPORT_BT_ATTENDANCE_LIST } from '@/endpoint/report/api';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
import FormAutocomplete from '@/components/Input/formDropdown';
import { FormProvider, get, useForm } from 'react-hook-form';
import useDropdownOptions from '@/lib/getDropdown';

interface Props {}

export const Index = ({}: Props) => {
    // Filter states
    const [startDate, setStartDate] = React.useState<string | null>(null);
    const [endDate, setEndDate] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { showToast } = useAlert();
    const methods = useForm();

    const exporter = async (data: string) => {
        try {
            // Kirim permintaan ke endpoint dengan filter
            const response = await axiosInstance.get(REPORT_BT_ATTENDANCE_EXPORT + data, {
                responseType: "blob"
            });

            // Membuat file dari respons
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Business_Trip_Attendance_Report.xlsx'); // Nama file
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
        <FormProvider {...methods}>
            <div className='flex md:mb-4 mb-2 w-full'>
                {/* Filters */}
                <div className='flex gap-4 mb-4 overflow-x-auto lg:overflow-y-hidden'>
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
                </div>
            </div>
            <DataGridComponent
                isHistory={false}
                onExportXls={async (x: string) => await exporter(x)}
                defaultSearch={`?startDate=${startDate || ''}&endDate=${endDate || ''}&`}
                columns={columns}
                url={{
                    url: REPORT_BT_ATTENDANCE_LIST,
                }}
                labelFilter='search'
            />
        </FormProvider>
    );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
    <MainLayout title='Report' description='Business Trip Attendance'>
        {page}
    </MainLayout>
);

export default Index;
