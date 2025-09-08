import { ReactNode } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { formModel } from './model/formModel';
import { useForm } from 'react-hook-form';
import { CREATE_SETTING_APPROVAL } from '@/endpoint/settingApproval/api';
import { LIST_PAGE_SETTING_APPROVAL } from '@/endpoint/settingApproval/page';

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
            url={CREATE_SETTING_APPROVAL}
            redirectUrl={LIST_PAGE_SETTING_APPROVAL}
          />
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Approval Setting' description='Approval Setting Create'>
    {page}
  </MainLayout>
);

export default Create;
