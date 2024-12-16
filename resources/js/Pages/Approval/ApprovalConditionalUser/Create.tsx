import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { CREATE_APPROVAL_CONDITIONAL_USER } from '@/endpoint/settingApprovalPrConditionalUser/api';
import { LIST_PAGE_APPROVAL_CONDITIONAL_USER } from '@/endpoint/settingApprovalPrConditionalUser/page';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import CustomeForm from './model/customeForm';
import { formModel } from './model/formModel';

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
            url={CREATE_APPROVAL_CONDITIONAL_USER}
            redirectUrl={LIST_PAGE_APPROVAL_CONDITIONAL_USER}
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
  <MainLayout title='Approval Conditional User' description='Approval Conditional User Create'>
    {page}
  </MainLayout>
);

export default Create;
