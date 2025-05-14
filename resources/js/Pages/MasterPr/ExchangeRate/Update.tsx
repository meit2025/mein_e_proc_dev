import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { formModel, modelDropdowns } from './model/formModel';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/axiosInstance';
import { usePage } from '@inertiajs/react';
import { DETAIL_MASTER_UOM, EDIT_MASTER_UOM } from '@/endpoint/uom/api';
import { LIST_PAGE_MASTER_UOM } from '@/endpoint/uom/page';
import { DETAIL_MASTER_EXCHANGERATE, EDIT_MASTER_EXCHANGERATE } from '@/endpoint/exchangeRate/api';
import { LIST_PAGE_MASTER_EXCHANGERATE } from '@/endpoint/exchangeRate/page';
import useDropdownOptionsArray from '@/lib/getDropdownArray';

const Update = ({ id }: { id: number }) => {
  const { props } = usePage();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { dropdownOptions, getDropdown } = useDropdownOptionsArray();
  useEffect(() => {
    getDropdown(modelDropdowns, formModel);
  }, []);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_MASTER_EXCHANGERATE(props.id));
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

  useEffect(() => {
    getdetail();
  }, [getdetail]);


  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            isLoading={isLoading}
            methods={methods}
            formModel={dropdownOptions}
            url={`${EDIT_MASTER_EXCHANGERATE}/${props.id}`}
            redirectUrl={LIST_PAGE_MASTER_EXCHANGERATE}
          />
        </div>
      </div>
    </>
  );
};

// Assign layout to the page
Update.layout = (page: ReactNode) => (
  <MainLayout title='Exchange Rate' description='Exchange Rate Update'>
    {page}
  </MainLayout>
);

export default Update;
