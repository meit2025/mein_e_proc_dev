import { ReactNode, useEffect } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { useForm } from 'react-hook-form';
import { usePage } from '@inertiajs/react';
import { LIST_PAGE_API } from '@/endpoint/getway/page';
import { formModelValue } from '../model/formModel';
import { CREATE_GATEWAY_VALUE, DETAIL_GATEWAY_VALUE } from '@/endpoint/getwayValue/api';

function Create({ id }: { id: number }) {
  const { props } = usePage();
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    methods.setValue('gateways_id', id);
  }, [id, methods]);
  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            methods={methods}
            formModel={formModelValue}
            url={CREATE_GATEWAY_VALUE}
            redirectUrl={`${DETAIL_GATEWAY_VALUE}/${id}`}
          />
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Api' description='Api Create'>
    {page}
  </MainLayout>
);

export default Create;
