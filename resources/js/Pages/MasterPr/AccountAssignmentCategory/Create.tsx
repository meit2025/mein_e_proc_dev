import { ReactNode } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { formModel } from './model/formModel';
import { useForm } from 'react-hook-form';
import { CREATE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY } from '@/endpoint/accountAssignmentCategory/api';
import { LIST_PAGE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY } from '@/endpoint/accountAssignmentCategory/page';

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
            url={CREATE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY}
            redirectUrl={LIST_PAGE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY}
          />
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Account Assignment Category' description='Account Assignment Category Create'>
    {page}
  </MainLayout>
);

export default Create;
