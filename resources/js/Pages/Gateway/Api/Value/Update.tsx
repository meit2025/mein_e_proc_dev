import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/Components/form/FormMapping';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/axiosInstance';
import { usePage } from '@inertiajs/react';
import { DETAIL_API, EDIT_API } from '@/endpoint/getway/api';
import { DETAIL_PAGE_API, LIST_PAGE_API } from '@/endpoint/getway/page';
import { formModelValue } from '../model/formModel';
import { DETAIL_GATEWAY_VALUE, EDIT_GATEWAY_VALUE } from '@/endpoint/getwayValue/api';
import { number } from 'zod';

const Update = ({ id }: { id: number }) => {
  const { props } = usePage();
  const [dataDetail, setDataDetail] = useState({
    gateways_id: 0,
    column_value: '',
    value: '',
  });

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_GATEWAY_VALUE(props.id));
        const data = response.data;
        methods.reset(data.data);
        setDataDetail(data.data);
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
            formModel={formModelValue}
            url={`${EDIT_GATEWAY_VALUE}/${props.id}`}
            redirectUrl={`${DETAIL_PAGE_API}/${dataDetail?.gateways_id}`}
          />
        </div>
      </div>
    </>
  );
};

// Assign layout to the page
Update.layout = (page: ReactNode) => (
  <MainLayout title='Api' description='Api Update'>
    {page}
  </MainLayout>
);

export default Update;
