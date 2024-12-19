import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_PR, GET_PR } from '@/endpoint/purchaseRequisition/api';
import { columns } from './model/listModel';
import { CREATE_PAGE_PR, DETAIL_PAGE_PR, EDIT_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
import { PAGE_REPORT_PURCHASE } from '@/endpoint/report/page';
import { REPORT_PURCHASE_EXPORT, REPORT_PURCHASE_LIST } from '@/endpoint/report/api';

const roleAkses = 'report purchase requisition';
const roleConfig = {
    detail: `${roleAkses} view`,
    export: `${roleAkses} export`,
};
export const Index = () => {
    const { showToast } = useAlert();

    const exporter = async (data: string) => {
        try {
            console.log(data);

            // Kirim permintaan ke endpoint dengan filter
            const response = await axiosInstance.get(REPORT_PURCHASE_EXPORT + data, {
            });

            // Membuat file dari respons
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Purchase_Report.csv'); // Nama file
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
        // detailUrl: DETAIL_PAGE_PR,
    };

    return (
        <DataGridComponent
            onExport={async (x: string) => await exporter(x)}
            role={roleConfig}
            columns={columns}
            url={urlConfig}
            labelFilter='search'
        />
    );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
    <MainLayout title='Report' description='Purchase Requisition'>
        {page}
    </MainLayout>
);

export default Index;
