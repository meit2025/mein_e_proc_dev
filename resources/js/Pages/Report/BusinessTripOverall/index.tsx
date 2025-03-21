import DataGridComponent from '@/components/commons/DataGrid';
import { DETAIL_PAGE_BUSINESS_TRIP } from '@/endpoint/business-trip/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import React, { ReactNode, useState, useEffect } from 'react';
import {columns} from './models/models';
import { REPORT_BT_OVERALL_EXPORT, REPORT_BT_OVERALL_LIST } from '@/endpoint/report/api';
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
    const { dataDropdown: dataStatus, getDropdown: getStatus } = useDropdownOptions();
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const { dataDropdown: dataPurposeType, getDropdown: getPurposeType } = useDropdownOptions();
    const [purposeTypeFilter, setPurposeTypeFilter] = useState<string | null>(null);
    const { dataDropdown: dataDestination, getDropdown: getDestination } = useDropdownOptions();
    const [destinationFilter, setDestinationFilter] = useState<string | null>(null);
    const { dataDropdown: dataDepartment, getDropdown: getDepartment } = useDropdownOptions();
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);

    useEffect(() => {
        getStatus('', {
            name: 'name',
            id: 'code',
            tabel: 'master_statuses',
        });

        getPurposeType('', {
            name: 'name',
            id: 'id',
            tabel: 'purpose_types',
        });

        getDestination('', {
            name: 'destination',
            id: 'destination',
            tabel: 'destinations',
        });

        getDepartment('', {
            name: 'name',
            id: 'id',
            tabel: 'master_departments',
        });
    }, []);

    const exporter = async (data: string) => {
        try {
            setIsLoading(true);
            // Kirim permintaan ke endpoint dengan filter
            const response = await axiosInstance.get(REPORT_BT_OVERALL_EXPORT + data, {
                responseType: "blob"
            });

            // Membuat file dari respons
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Business_Trip_Overall_Report.xlsx'); // Nama file
            document.body.appendChild(link);
            link.click();

            showToast('File berhasil diekspor!', 'success');
        } catch (error: any) {
            showToast(
                error.response?.data?.message || 'Terjadi kesalahan saat ekspor.',
                'error'
            );
        } finally {
            setIsLoading(false); // Selesai loading
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
                    <div>
                        <label htmlFor='status' className='block mb-1'>Purpose Type</label>
                        <FormAutocomplete<any>
                            fieldName='purposeType'
                            placeholder={'Select Purpose Type'}
                            classNames='mt-2 w-40'
                            fieldLabel={''}
                            options={dataPurposeType}
                            onSearch={(search: string) => {
                                const isLabelMatch = dataPurposeType?.some(option => option.label === search);
                                if (search.length > 0 && !isLabelMatch) {
                                    getPurposeType(search, {
                                        name: 'name',
                                        id: 'id',
                                        tabel: 'purpose_types',
                                        search: search,
                                    });
                                } else {
                                    getPurposeType('', {
                                        name: 'name',
                                        id: 'id',
                                        tabel: 'purpose_types',
                                    });
                                }
                            }}
                            onChangeOutside={(data: any) => {
                                setPurposeTypeFilter(data);
                            }}
                            onFocus={() => {
                                getPurposeType('', {
                                    name: 'name',
                                    id: 'id',
                                    tabel: 'purpose_types',
                                })
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor='department' className='block mb-1'>Department</label>
                        <FormAutocomplete<any>
                            fieldName='department'
                            placeholder={'Select Department'}
                            classNames='mt-2 w-40'
                            fieldLabel={''}
                            options={dataDepartment}
                            onSearch={(search: string) => {
                                const isLabelMatch = dataPurposeType?.some(option => option.label === search);
                                if (search.length > 0 && !isLabelMatch) {
                                    getDepartment(search, {
                                        name: 'name',
                                        id: 'id',
                                        tabel: 'master_departments',
                                        search: search,
                                    });
                                } else {
                                    getDepartment('', {
                                        name: 'name',
                                        id: 'id',
                                        tabel: 'master_departments',
                                    });
                                }
                            }}
                            onChangeOutside={(data: any) => {
                                setDepartmentFilter(data);
                            }}
                            onFocus={() => {
                                getDepartment('', {
                                    name: 'name',
                                    id: 'id',
                                    tabel: 'master_departments',
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
            <DataGridComponent
                isHistory={false}
                onExportXls={async (x: string) => await exporter(x)}
                isLoading={isLoading}
                defaultSearch={`?startDate=${startDate || ''}&endDate=${endDate || ''}&status=${statusFilter || ''}&type=${purposeTypeFilter || ''}&destination=${destinationFilter || ''}&department=${departmentFilter || ''}&`}
                columns={columns}
                url={{
                    url: REPORT_BT_OVERALL_LIST,
                    // detailUrl: DETAIL_PAGE_BUSINESS_TRIP,
                }}
                labelFilter='search'
            />
        </FormProvider>
    );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
    <MainLayout title='Report' description='Business Trip Overall'>
        {page}
    </MainLayout>
);

export default Index;
