import { ReactNode } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { CREATE_SECRET } from '@/endpoint/secret/api';
import { LIST_PAGE_SECRET } from '@/endpoint/secret/page';
import { formModel } from './model/formModel';
import { useForm } from 'react-hook-form';
import { CREATE_MASTER_DOKUMENT_TYPE } from '@/endpoint/dokumentType/api';
import { LIST_PAGE_MASTER_DOKUMENT_TYPE } from '@/endpoint/dokumentType/page';

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
            url={CREATE_MASTER_DOKUMENT_TYPE}
            redirectUrl={LIST_PAGE_MASTER_DOKUMENT_TYPE}
          />
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Dokument Type' description='Dokument Type Create'>
    {page}
  </MainLayout>
);

export default Create;
