import { CustomDialog } from '@/components/commons/CustomDialog';
import DataGridComponent from '@/components/commons/DataGrid';
import {
    DETAIL_REIMBURSE,
    LIST_REIMBURSE,
    STORE_REIMBURSE,
    UPDATE_REIMBURSE,
} from '@/endpoint/reimburse/api';
import { FormType } from '@/lib/utils';
import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import {
    columns,
    CostCenter,
    Currency,
    Period,
    PurchasingGroup,
    Tax,
    User,
} from './model/listModel';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
import { PAGE_REPORT } from '@/endpoint/report/page';
import { REPORT_REIMBURSE_EXPORT, REPORT_REIMBURSE_LIST } from '@/endpoint/report/api';

interface Props {
    users: User[];
    categories: string;
    periods: Period[];
    currencies: Currency[];
    purchasing_groups: PurchasingGroup[];
    taxes: Tax[];
    cost_center: CostCenter[];
    currentUser: User;
    latestPeriod: any;
}

const roleAkses = 'reimburse';
const roleConfig = {
    detail: `${roleAkses} view`,
    create: `${roleAkses} create`,
    update: `${roleAkses} update`,
    delete: `${roleAkses} delete`,
};

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
}: Props) => {
    const [openForm, setOpenForm] = React.useState<boolean>(false);
    const [formType, setFormType] = React.useState({
        type: FormType.create,
        id: undefined,
    });

    function openFormHandler() {
        setFormType({
            type: FormType.create,
            id: null,
        });
        setOpenForm(!openForm);
    }

    const { showToast } = useAlert();

    const exporter = async (data: string) => {
        try {
            console.log(data);

            // Kirim permintaan ke endpoint dengan filter
            const response = await axiosInstance.get(REPORT_REIMBURSE_EXPORT + data, {
            });

            console.log(response);


            // Membuat file dari respons
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Reimburse_Report.csv'); // Nama file
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
            <div className='flex md:mb-4 mb-2 w-full justify-end'>
                {/* Tambahkan tombol atau elemen lain di sini jika diperlukan */}
            </div >

            <DataGridComponent
                isHistory={false}
                onExport={async (x: string) => await exporter(x)}
                role={roleConfig}
                columns={columns}
                url={{
                    url: REPORT_REIMBURSE_LIST,
                    // detailUrl: '/reimburse/detail',
                }}
                labelFilter='search'
            />
        </>
    );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
    <MainLayout title='Report' description='Reimburse'>
        {page}
    </MainLayout>
);

export default Index;
