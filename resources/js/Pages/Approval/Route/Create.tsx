import { ReactNode, useEffect } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { formModel } from './model/formModel';
import { useForm } from 'react-hook-form';
import { CREATE_APPROVAL_ROUTE } from '@/endpoint/approvalRoute/api';
import { LIST_PAGE_APPROVAL_ROUTE } from '@/endpoint/approvalRoute/page';
import CustomeForm from './model/customeForm';

function Create() {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  useEffect(() => {
    methods.setValue('type_approval_conditional', 'nominal');
    methods.setValue('nominal', 0);
    methods.setValue('day', 0);
  }, []);
  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            methods={methods}
            formModel={formModel}
            url={CREATE_APPROVAL_ROUTE}
            redirectUrl={LIST_PAGE_APPROVAL_ROUTE}
            formLogic={
              <CustomeForm
                data={[
                  {
                    user_id: '',
                  },
                ]}
              />
            }
          />
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Approval Route' description='Approval Route Create'>
    {page}
  </MainLayout>
);

export default Create;
