import MainLayout from '@/Pages/Layouts/MainLayout';
import React from 'react';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_PR, GET_PR } from '@/endpoint/purchaseRequisition/api';
import { columns } from './model/listModel';
import { CREATE_PAGE_PR, DETAIL_PAGE_PR, EDIT_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
import { PAGE_REPORT_PURCHASE } from '@/endpoint/report/page';
import { REPORT_PURCHASE_EXPORT, REPORT_PURCHASE_LIST, REPORT_PURCHASE_TYPES, REPORT_PURCHASE_VENDORS, REPORT_PURCHASE_DEPARTMENTS, REPORT_PURCHASE_STATUSES } from '@/endpoint/report/api';
interface ReportType {
    id: string;
    purchasing_doc: string;
};

interface ReportVendor {
    id: string;
    vendor: string;
}

interface ReportDepartment {
    id: string;
    name: string;
}

interface ReportStatus {
    code: string;
    name: string;
}



const roleAkses = 'report purchase requisition';
const roleConfig = {
    detail: `${roleAkses} view`,
    export: `${roleAkses} export`,
};



export const Index = () => {
    React.useEffect(() => {
        const loadReportTypes = async () => {
            try {
                const reportTypes = await fetchReportTypes();
                setTypes(reportTypes);

            } catch (error) {
                showToast('Failed to load report types', 'error');
            }
        };
        const loadReportVendors = async () => {
            try {
                const reporVendors = await fetchReportVendors();
                setVendors(reporVendors);

            } catch (error) {
                showToast('Failed to load report types', 'error');
            }
        };
        const loadReportDepartments = async () => {
            try {
                const reportDepartments = await fetchReportDepartments();
                setDepartments(reportDepartments);

            } catch (error) {
                showToast('Failed to load report types', 'error');
            }
        };

        const loadReportStatuses = async () => {
            try {
                const reportStatuses = await fetchReportStatuses();
                setStatuses(reportStatuses);

            } catch (error) {
                showToast('Failed to load report types', 'error');
            }
        };

        loadReportTypes();
        loadReportVendors();
        loadReportDepartments();
        loadReportStatuses();
    }, []);

    const { showToast } = useAlert();
    // Filter states
    const [startDate, setStartDate] = React.useState<string | null>(null);
    const [endDate, setEndDate] = React.useState<string | null>(null);
    const [status, setStatus] = React.useState<string>('');
    const [statuses, setStatuses] = React.useState<ReportStatus[]>([]);
    const [type, setType] = React.useState<string>('');
    const [types, setTypes] = React.useState<ReportType[]>([]);
    const [vendor, setVendor] = React.useState<string>('');
    const [vendors, setVendors] = React.useState<ReportVendor[]>([]);
    const [department, setDepartment] = React.useState<string>('');
    const [departments, setDepartments] = React.useState<ReportDepartment[]>([]);

    const fetchReportTypes = async (): Promise<ReportType[]> => {
        try {
            const response = await axiosInstance.get(REPORT_PURCHASE_TYPES);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching report types:', error);
            return []; // Return an empty array to prevent errors
        }
    };

    const fetchReportVendors = async (): Promise<ReportVendor[]> => {
        try {
            const response = await axiosInstance.get(REPORT_PURCHASE_VENDORS);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching report types:', error);
            return []; // Return an empty array to prevent errors
        }
    };

    const fetchReportDepartments = async (): Promise<ReportDepartment[]> => {
        try {
            const response = await axiosInstance.get(REPORT_PURCHASE_DEPARTMENTS);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching report types:', error);
            return []; // Return an empty array to prevent errors
        }
    };

    const fetchReportStatuses = async (): Promise<ReportStatus[]> => {
        try {
            const response = await axiosInstance.get(REPORT_PURCHASE_STATUSES);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching report types:', error);
            return []; // Return an empty array to prevent errors
        }
    };

    const exporter = async (data: string) => {
        try {

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
        <>
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
                        <label htmlFor='end-date' className='block mb-1'>Document Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="select-class"
                            id="type"
                        >
                            <option value="">All Types</option>
                            {types.map((typeOption) => (
                                <option
                                    key={typeOption.purchasing_doc}
                                    value={typeOption.purchasing_doc}
                                >
                                    {typeOption.purchasing_doc}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='end-date' className='block mb-1'>Propose vendor
                        </label>
                        <select
                            value={vendor}
                            onChange={(e) => setVendor(e.target.value)}
                            className="select-class"
                            id="vendor"
                        >
                            <option value="">All Vendor</option>
                            {vendors.map((vendorOption) => (
                                <option
                                    key={vendorOption.id}
                                    value={vendorOption.id}
                                >
                                    {vendorOption.vendor}
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
                onExportXls={async (x: string) => await exporter(x)}
                defaultSearch={`?startDate=${startDate || ''}&endDate=${endDate || ''}&status=${status || ''}&type=${type || ''}&vendor=${vendor || ''}&`}
                columns={columns}
                url={urlConfig}
                labelFilter='search'
            />
        </>
    );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
    <MainLayout title='Report' description='Purchase Requisition'>
        {page}
    </MainLayout>
);

export default Index;
