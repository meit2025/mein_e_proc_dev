import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { CREATE_USER, DETAIL_USER, EDIT_USER } from '@/endpoint/user/api';
import { LIST_PAGE_USER } from '@/endpoint/user/page';
import { formModel } from './model/formModel';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/axiosInstance';
import { usePage } from '@inertiajs/react';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import useDropdownOptions from '@/lib/getDropdown';

const Update = ({ id }: { id: number }) => {
  const { props } = usePage();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_USER(props.id));
        const data = response.data;
        methods.reset(data.data);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [methods, props.id], // Include `methods` in the dependency array
  );

  const [dataModel, setDataModel] = useState(formModel);
  const { dropdownOptions, getDropdown } = useDropdownOptions();

  useEffect(() => {
    getDropdown(
      'master_business_partner_id',
      {
        name: 'name_one',
        id: 'id',
        tabel: 'master_business_partners',
        where: {
          key: 'type',
          parameter: 'employee',
        },
      },
      formModel,
    );
  }, []);

  useEffect(() => {
    getdetail();
    setDataModel(dropdownOptions as FormFieldModel<any>[]);
  }, [dropdownOptions, getdetail]);

  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            isLoading={isLoading}
            methods={methods}
            formModel={dataModel}
            url={`${EDIT_USER}/${props.id}`}
            redirectUrl={LIST_PAGE_USER}
          />
        </div>
      </div>
    </>
  );
};

// Assign layout to the page
Update.layout = (page: ReactNode) => (
  <MainLayout title='User' description='User Update'>
    {page}
  </MainLayout>
);

export default Update;
