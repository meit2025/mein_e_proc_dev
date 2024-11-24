import MainLayout from '@/Pages/Layouts/MainLayout';
import axiosInstance from '@/axiosInstance';
import FormMapping from '@/components/form/FormMapping';
import { DETAIL_MASTER_DIVISION } from '@/endpoint/masterDivision/api';
import { EDIT_MASTER_POSITION } from '@/endpoint/masterPosition/api';
import { LIST_PAGE_MASTER_POSITION } from '@/endpoint/masterPosition/page';
import { usePage } from '@inertiajs/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formModel } from './model/formModel';

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
        const response = await axiosInstance.get(DETAIL_MASTER_DIVISION(props.id));
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
            formModel={formModel}
            url={`${EDIT_MASTER_POSITION}/${props.id}`}
            redirectUrl={LIST_PAGE_MASTER_POSITION}
          />
        </div>
      </div>
    </>
  );
};

// Assign layout to the page
Update.layout = (page: ReactNode) => (
  <MainLayout title='Master Division' description='Master Division Update'>
    {page}
  </MainLayout>
);

export default Update;
