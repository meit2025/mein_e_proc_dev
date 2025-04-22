import React, { useState,useEffect } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { REPORT_REIMBURSE_LIST, REPORT_REIMBURSE_EXPORT } from '@/endpoint/report/api';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
import { columns } from './model/listModel';
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
    const { dataDropdown: dataReimburseType, getDropdown: getReimburseType } = useDropdownOptions();
    const [reimburseTypeFilter, setReimburseTypeFilter] = useState<string | null>(null);
    const { dataDropdown: dataDepartment, getDropdown: getDepartment } = useDropdownOptions();
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);

    useEffect(() => {
        getStatus('', {
            name: 'name',
            id: 'code',
            tabel: 'master_statuses',
        });

        getReimburseType('', {
            name: 'name',
            id: 'code',
            tabel: 'master_type_reimburses',
        });

        getDepartment('', {
            name: 'name',
            id: 'id',
            tabel: 'master_departments',
        });
    }, []);

    // Handle Exporter
    const exporter = async (data: string) => {
        try {
            setIsLoading(true);
            // const params = new URLSearchParams({
            //     startDate: startDate || '',
            //     endDate: endDate || '',
            //     status: status || '',
            //     type: type || '',
            //     pdf: String(pdf),
            // }).toString();

            // const response = await axiosInstance.get(`${REPORT_REIMBURSE_EXPORT}?${params}`, {
            //     responseType: 'blob',
            // });
            const response = await axiosInstance.get(REPORT_REIMBURSE_EXPORT + data, {
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            // link.setAttribute('download', `Reimburse_Report.${pdf ? 'pdf' : 'xlsx'}`);
            link.setAttribute('download', 'Reimburse_Report.xlsx'); // Nama file
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
            <div className='flex flex-col w-full mb-2 md:mb-4'>
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
                        <label htmlFor='status' className='block mb-1'>Status</label>
                        <FormAutocomplete<any>
                            fieldName='status'
                            placeholder={'Select Status'}
                            classNames='mt-2 w-64'
                            fieldLabel={''}
                            options={dataStatus}
                            onSearch={(search: string) => {
                                const isLabelMatch = dataStatus?.some(option => option.label === search);
                                if (search.length > 0 && !isLabelMatch) {
                                    getStatus(search, {
                                        name: 'name',
                                        id: 'code',
                                        tabel: 'master_statuses',
                                        search: search,
                                    });
                                } else if (search.length == 0 && !isLabelMatch) {
                                    getStatus('', {
                                        name: 'name',
                                        id: 'code',
                                        tabel: 'master_statuses',
                                    });
                                }
                            }}
                            onChangeOutside={(data: any) => {
                                setStatusFilter(data);
                            }}
                            onFocus={() => {
                                getStatus('', {
                                    name: 'name',
                                    id: 'code',
                                    tabel: 'master_statuses',
                                })
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor='reimburse_type' className='block mb-1'>Reimburse Type</label>
                        <FormAutocomplete<any>
                            fieldName='reimburse_type'
                            placeholder={'Select Reimburse Type'}
                            classNames='mt-2 w-64'
                            fieldLabel={''}
                            options={dataReimburseType}
                            onSearch={(search: string) => {
                                const isLabelMatch = dataReimburseType?.some(option => option.label === search);
                                if (search.length > 0 && !isLabelMatch) {
                                    getReimburseType(search, {
                                        name: 'name',
                                        id: 'code',
                                        tabel: 'master_type_reimburses',
                                        search: search,
                                    });
                                } else if (search.length == 0 && !isLabelMatch) {
                                    getReimburseType('', {
                                        name: 'name',
                                        id: 'code',
                                        tabel: 'master_type_reimburses',
                                    });
                                }
                            }}
                            onChangeOutside={(data: any) => {
                                setReimburseTypeFilter(data);
                            }}
                            onFocus={() => {
                                getReimburseType('', {
                                    name: 'name',
                                    id: 'code',
                                    tabel: 'master_type_reimburses',
                                })
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor='department' className='block mb-1'>Department</label>
                        <FormAutocomplete<any>
                            fieldName='department'
                            placeholder={'Select Department'}
                            classNames='mt-2 w-64'
                            fieldLabel={''}
                            options={dataDepartment}
                            onSearch={(search: string) => {
                                const isLabelMatch = dataReimburseType?.some(option => option.label === search);
                                if (search.length > 0 && !isLabelMatch) {
                                    getDepartment(search, {
                                        name: 'name',
                                        id: 'id',
                                        tabel: 'master_departments',
                                        search: search,
                                    });
                                } else if (search.length == 0 && !isLabelMatch) {
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
                                });
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Data Grid Component */}
            <DataGridComponent
                isHistory={false}
                onExportXls={async (x: string) => await exporter(x)}
                isLoading={isLoading}
                defaultSearch={`?startDate=${startDate || ''}&endDate=${endDate || ''}&status=${statusFilter || ''}&type=${reimburseTypeFilter || ''}&department=${departmentFilter || ''}&`}
                columns={columns}
                url={{
                    url: `${REPORT_REIMBURSE_LIST}`,
                    detailUrl: '/reimburse/detail',
                }}
                labelFilter='Search'
            />
        </FormProvider>
    );
};

// Assign layout to the page
Index.layout = (page: React.ReactNode) => (
    <MainLayout title='Report' description='Reimburse'>
        {page}
    </MainLayout>
);

export default Index;
