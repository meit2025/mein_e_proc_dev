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
import { PurposeTypeModel } from '../PurposeType/models/models';
import { BussinessTripFormV1 } from './components/BussinessTripFormV1';
import { REPORT_BT_DEC_EXPORT, REPORT_BT_DEC_LIST } from '@/endpoint/report/api';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';

interface propsType {
    listPurposeType: PurposeTypeModel[];
    users: UserModel[];
    listBusinessTrip: any;
}
const roleAkses = 'business trip declaration';
export const Index = ({ listPurposeType, users, listBusinessTrip }: propsType) => {
    const [openForm, setOpenForm] = React.useState<boolean>(false);

    const [businessTripForm, setBusinessTripForm] = React.useState({
        type: BusinessTripType.create,
        id: undefined,
    });

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
            <div className='flex md:mb-4 mb-2 w-full justify-end'>
                {/* <Button onClick={openFormHandler}>
          <PlusIcon />
        </Button> */}

                <CustomDialog
                    onClose={() => setOpenForm(false)}
                    open={openForm}
                    onOpenChange={openFormHandler}
                >
                    <BussinessTripFormV1
                        users={users}
                        listPurposeType={listPurposeType}
                        listBusinessTrip={listBusinessTrip}
                    />
                </CustomDialog>
            </div>
            <DataGridComponent
                isHistory={false}
                role={{
                    detail: `${roleAkses} view`,
                    create: `${roleAkses} export`,
                }}
                // onCreate={openFormHandler}
                onExport={async (x: string) => await exporter(x)}
                columns={columns}
                // actionType='dropdown'
                // onEdit={(value) => {
                //     setBusinessTripForm({
                //         type: BusinessTripType.edit,
                //         id: value.toString(),
                //     });
                //     setOpenForm(true);
                // }}
                url={{
                    url: REPORT_BT_DEC_LIST,
                    // deleteUrl: DELET_API,
                    // detailUrl: DETAIL_PAGE_BUSINESS_TRIP_DECLARATION,
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
