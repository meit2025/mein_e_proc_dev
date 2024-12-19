import { CustomDialog } from '@/components/commons/CustomDialog';
import DataGridComponent from '@/components/commons/DataGrid';
import { DELET_API_BUSINESS_TRIP, GET_LIST_BUSINESS_TRIP } from '@/endpoint/business-trip/api';
import { DETAIL_PAGE_BUSINESS_TRIP } from '@/endpoint/business-trip/page';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import React, { ReactNode } from 'react';
import { DestinationModel } from '../Destination/models/models';
import { PurposeTypeModel } from '../PurposeType/models/models';
import { BussinessTripFormV1 } from './components/BussinessTripFormV1';
import {
    BusinessTripType,
    columns,
    Costcenter,
    Pajak,
    PurchasingGroup,
    UserModel,
} from './models/models';
import { REPORT_BT_EXPORT, REPORT_BT_LIST } from '@/endpoint/report/api';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
interface propsType {
    listPurposeType: PurposeTypeModel[];
    users: UserModel[];
    pajak: Pajak[];
    costcenter: Costcenter[];
    purchasingGroup: PurchasingGroup[];
    listDestination: DestinationModel[];
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
    listPurposeType,
    users,
    pajak,
    costcenter,
    purchasingGroup,
    listDestination,
}: propsType) => {
    const [openForm, setOpenForm] = React.useState<boolean>(false);

    const [businessTripForm, setBusinessTripForm] = React.useState({
        type: BusinessTripType.create,
        id: undefined,
    });

    function openFormHandler() {
        setOpenForm(!openForm);
    }

    const { auth } = usePage().props as unknown as SharedProps;

    // Get the logged-in user's ID
    const userId = auth.user?.id;
    const isAdmin = auth.user?.is_admin;

    const { showToast } = useAlert();

    const exporter = async (data: string) => {
        try {
            console.log(data);

            // Kirim permintaan ke endpoint dengan filter
            const response = await axiosInstance.get(REPORT_BT_EXPORT + data, {
            });

            console.log(response);


            // Membuat file dari respons
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Business_Trip_Request_Report.csv'); // Nama file
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
            </div>
            <DataGridComponent
                isHistory={false}
                role={{
                    detail: `${roleAkses} view`,
                    create: `${roleAkses} export`,
                }}
                onExport={async (x: string) => await exporter(x)}
                // onCreate={openFormHandler}
                columns={columns}
                // onEdit={(value) => {
                //     setBusinessTripForm({
                //         type: BusinessTripType.edit,
                //         id: value.toString(),
                //     });
                //     setOpenForm(true);
                // }}
                url={{
                    url: REPORT_BT_LIST,
                }}
                labelFilter='search'
            />
        </>
    );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
    <MainLayout title='Report' description='Business Trip'>
        {page}
    </MainLayout>
);

export default Index;
