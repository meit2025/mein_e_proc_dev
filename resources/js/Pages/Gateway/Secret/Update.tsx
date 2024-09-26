import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { CREATE_SECRET, DETAIL_SECRET, EDIT_SECRET } from '@/endpoint/secret/api';
import { LIST_PAGE_SECRET } from '@/endpoint/secret/page';
import { formModel } from './model/formModel';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/axiosInstance';
import { usePage } from '@inertiajs/react';

const Update = ({ id }: { id: number }) => {
  const { props } = usePage();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getdetail = useCallback(
    async () => {
      console.log('ini id', id);
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_SECRET(props.id));
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
            url={`${EDIT_SECRET}/${props.id}`}
            redirectUrl={LIST_PAGE_SECRET}
          />
        </div>
      </div>
    </>
  );
};

// Assign layout to the page
Update.layout = (page: ReactNode) => (
  <MainLayout title='Gateway' description='Gateway Secret Update'>
    {page}
  </MainLayout>
);

export default Update;
