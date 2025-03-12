import MainLayout from '@/Pages/Layouts/MainLayout';
import React from 'react';
import { ReactNode, useState, useEffect } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columns } from './model/listModel';
import { DETAIL_PAGE_PR} from '@/endpoint/purchaseRequisition/page';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
import { REPORT_PURCHASE_EXPORT, REPORT_PURCHASE_LIST, REPORT_PURCHASE_VENDORS } from '@/endpoint/report/api';
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
    const { dataDropdown: dataType, getDropdown: getType } = useDropdownOptions();
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const { dataDropdown: dataVendor, getDropdown: getVendor } = useDropdownOptions(REPORT_PURCHASE_VENDORS);
    const [vendorFilter, setVendorFilter] = useState<string | null>(null);
    const { dataDropdown: dataDepartment, getDropdown: getDepartment } = useDropdownOptions();
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);

    useEffect(() => {
        getStatus('', {
            name: 'name',
            id: 'code',
            tabel: 'master_statuses',
        });

        getType('', {
            name: 'purchasing_doc',
            id: 'id',
            tabel: 'document_types',
        });

        getVendor('', {
            name: 'label',
            id: 'value',
            tabel: 'vendors',
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
            const response = await axiosInstance.get(REPORT_PURCHASE_EXPORT + data, {
                responseType: "blob"
            });

            // Membuat file dari respons
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Purchase_Requisition_Report.xlsx'); // Nama file
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
    const urlConfig = {
        url: REPORT_PURCHASE_LIST,
        // addUrl: CREATE_PAGE_PR,
        // editUrl: EDIT_PAGE_PR,
        // deleteUrl: DELET_PR,
        detailUrl: DETAIL_PAGE_PR,
    };

    return (
        <FormProvider {...methods}>
            <div className='flex flex-col md:mb-4 mb-2 w-full'>
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
                        <label htmlFor='status' className='block mb-1'>Status</label>
                        <FormAutocomplete<any>
                            fieldName='status'
                            placeholder={'Select Status'}
                            classNames='mt-2 w-40'
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
                        <label htmlFor='type' className='block mb-1'>Document Type</label>
                        <FormAutocomplete<any>
                            fieldName='type'
                            placeholder={'Select Document Type'}
                            classNames='mt-2 w-40'
                            fieldLabel={''}
                            options={dataType}
                            onSearch={(search: string) => {
                                getType(search, {
                                    name: 'purchasing_doc',
                                    id: 'id',
                                    tabel: 'document_types',
                                });
                            }}
                            onChangeOutside={(data: any) => {
                                setTypeFilter(data);
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor='vendor' className='block mb-1'>Propose vendor</label>
                        <FormAutocomplete<any>
                            fieldName='vendor'
                            placeholder={'Select Propose vendor'}
                            classNames='mt-2 w-40'
                            fieldLabel={''}
                            options={dataVendor}
                            onSearch={(search: string) => {
                                getVendor(search, {
                                    name: 'label',
                                    id: 'value',
                                    tabel: 'vendors',
                                });
                            }}
                            onChangeOutside={(data: any) => {
                                setVendorFilter(data);
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
            <DataGridComponent
                onExportXls={async (x: string) => await exporter(x)}
                isLoading={isLoading}
                defaultSearch={`?startDate=${startDate || ''}&endDate=${endDate || ''}&status=${statusFilter || ''}&type=${typeFilter || ''}&vendor=${vendorFilter || ''}&department=${departmentFilter || ''}&`}
                columns={columns}
                url={urlConfig}
                labelFilter='search'
            />
        </FormProvider>
    );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
    <MainLayout title='Report' description='Purchase Requisition'>
        {page}
    </MainLayout>
);

export default Index;
