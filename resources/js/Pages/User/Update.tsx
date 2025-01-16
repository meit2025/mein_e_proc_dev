import MainLayout from '@/Pages/Layouts/MainLayout';
import axiosInstance from '@/axiosInstance';
import FormMapping from '@/components/form/FormMapping';
import { DETAIL_USER, EDIT_USER } from '@/endpoint/user/api';
import { LIST_PAGE_USER } from '@/endpoint/user/page';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import useDropdownOptionsArray from '@/lib/getDropdownArray';
import { usePage } from '@inertiajs/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formModel } from './model/formModel';
import { modelDropdowns } from './model/modelDropdown';

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
        methods.setValue(
          'master_business_partner_id',
          parseInt(data.data.master_business_partner_id),
        );
        methods.setValue('is_admin', data.data.is_admin === '0' ? false : true);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [methods, props.id], // Include `methods` in the dependency array
  );

  const [dataModel, setDataModel] = useState(formModel);
  const { dropdownOptions, getDropdown } = useDropdownOptionsArray();
  useEffect(() => {
    getDropdown(modelDropdowns, formModel);
  }, []);

  useEffect(() => {
    setDataModel(dropdownOptions as FormFieldModel<any>[]);
    getdetail();
  }, [dropdownOptions, getdetail]);

  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            isLoading={isLoading}
            methods={methods}
            formModel={(dataModel ?? []).filter((field: any) => field.name !== 'password')}
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
