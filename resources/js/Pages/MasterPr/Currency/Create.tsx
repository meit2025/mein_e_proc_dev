import { ReactNode } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { formModel } from './model/formModel';
import { useForm } from 'react-hook-form';
import { CREATE_MASTER_CURRENCY } from '@/endpoint/currency/api';
import { LIST_PAGE_MASTER_CURRENCY } from '@/endpoint/currency/page';

function Create() {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            methods={methods}
            formModel={formModel}
            url={CREATE_MASTER_CURRENCY}
            redirectUrl={LIST_PAGE_MASTER_CURRENCY}
          />
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Currency' description='Currency Create'>
    {page}
  </MainLayout>
);

export default Create;
