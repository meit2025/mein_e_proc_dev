import { ReactNode, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { formModel as initialFormModel } from './model/formModel';
import { useForm } from 'react-hook-form';
import { CREATE_PR } from '@/endpoint/purchaseRequisition/api';
import { LIST_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import axiosInstance from '@/axiosInstance';
import CustomeForm from './model/customeForm';

interface StructDropdown {
  id: string;
  tabel: string;
  name: string;
}

function Create() {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [formModel, setFormModel] = useState(initialFormModel);

    const getDropdown = async (dropdown: string, struct: StructDropdown) => {
        try {
            const response = await axiosInstance.get(
            `api/master/dropdown?name=${struct.name}&id=${struct.id}&tabelname=${struct.tabel}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            setFormModel((prevFormModel) =>
                prevFormModel.map((field) =>
                    field.name === dropdown ? { ...field, options: response.data.data } : field,
                ),
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDropdown('vendor', {
            id: 'partner_number',
            name: 'name_one',
            tabel: 'master_business_partners',
        });
        getDropdown('account_assignment_category_id', {
            id: 'account',
            name: 'description',
            tabel: 'account_assignment_categories',
        });
        getDropdown('storage_location_id', {
            id: 'id',
            name: 'storage_location',
            tabel: 'storage_locations',
        });
    }, []);
    return (
        <>
        <div className='card card-grid h-full min-w-full p-4'>
            <div className='card-body'>
            <FormMapping
                formLogic={<CustomeForm />}
                methods={methods}
                formModel={formModel}
                url={CREATE_PR}
                redirectUrl={LIST_PAGE_PR}
            />
            </div>
        </div>
        </>
    );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Purchase Requisition' description='Purchase Requisition Create'>
    {page}
  </MainLayout>
);

export default Create;
