import { ReactNode } from 'react';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { CREATE_USER } from '@/endpoint/user/api';
import { LIST_PAGE_USER } from '@/endpoint/user/page';
import { formModel } from './model/formModel';
import { useForm } from 'react-hook-form';

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
            url={CREATE_USER}
            redirectUrl={LIST_PAGE_USER}
          />
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='User' description='User Create'>
    {page}
  </MainLayout>
);

export default Create;
