import React, { useState,useEffect } from 'react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import DataGridComponent from '@/components/commons/DataGrid';
import { REPORT_REIMBURSE_LIST, REPORT_REIMBURSE_EXPORT } from '@/endpoint/report/api';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
import { FormType } from '@/lib/utils';
import { columns } from './model/listModel';
import FormAutocomplete from '@/components/Input/formDropdown';
import { FormProvider, get, useForm } from 'react-hook-form';
import useDropdownOptions from '@/lib/getDropdown';

interface Props {
    users: any[];
    categories: string;
    periods: any[];
    currencies: any[];
    purchasing_groups: any[];
    taxes: any[];
    cost_center: any[];
    currentUser: any;
    latestPeriod: any;
    types: any[];
    departments: any[];
    statuses: any[];
}

export const Index = ({
    purchasing_groups,
    users,
    categories,
    currencies,
    taxes,
    cost_center,
    periods,
    currentUser,
    latestPeriod,
    types,
    departments,
    statuses,
}: Props) => {
    const [openForm, setOpenForm] = React.useState<boolean>(false);
    const [formType, setFormType] = React.useState({
        type: FormType.create,
        id: undefined,
    });

    // Filter states
    const [startDate, setStartDate] = React.useState<string | null>(null);
    const [endDate, setEndDate] = React.useState<string | null>(null);
    const [status, setStatus] = React.useState<string>('');
    const [type, setType] = React.useState<string>('');
    const [department, setDepartment] = React.useState<string>('');
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
            <div className='flex flex-col md:mb-4 mb-2 w-full'>
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
                                if (search.length > 0) {
                                    getStatus(search, {
                                        name: 'name',
                                        id: 'code',
                                        tabel: 'master_statuses',
                                    });
                                }
                            }}
                            onChangeOutside={(data: any) => {
                                setStatusFilter(data);
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
                                getReimburseType(search, {
                                    name: 'name',
                                    id: 'code',
                                    tabel: 'master_type_reimburses',
                                });
                            }}
                            onChangeOutside={(data: any) => {
                                setReimburseTypeFilter(data);
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
                                getDepartment(search, {
                                    name: 'name',
                                    id: 'id',
                                    tabel: 'master_departments',
                                });
                            }}
                            onChangeOutside={(data: any) => {
                                setDepartmentFilter(data);
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
