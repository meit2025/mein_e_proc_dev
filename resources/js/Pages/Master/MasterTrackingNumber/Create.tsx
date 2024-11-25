import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { CREATE_MASTER_TRACKING_NUMBER } from '@/endpoint/masterTrackingNumber/api';
import { LIST_PAGE_MASTER_TRACKING_NUMBER } from '@/endpoint/masterTrackingNumber/page';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { formModel } from './model/formModel';

function Create() {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  return (
    <div className='card card-grid h-full min-w-full p-4'>
      <div className='card-body'>
        <FormMapping
          methods={methods}
          formModel={formModel}
          url={CREATE_MASTER_TRACKING_NUMBER}
          redirectUrl={LIST_PAGE_MASTER_TRACKING_NUMBER}
        />
      </div>
    </div>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Master Tracking Number' description='Master Tracking Number Create'>
    {page}
  </MainLayout>
);

export default Create;
