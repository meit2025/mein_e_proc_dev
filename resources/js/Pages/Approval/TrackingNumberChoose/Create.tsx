import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { CREATE_TRACKING_NUMBER_CHOOSE } from '@/endpoint/approvalTrackingNumberChoose/api';
import { LIST_PAGE_TRACKING_NUMBER_CHOOSE } from '@/endpoint/approvalTrackingNumberChoose/page';
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
            url={CREATE_TRACKING_NUMBER_CHOOSE}
            redirectUrl={LIST_PAGE_TRACKING_NUMBER_CHOOSE}
            formLogic={
              <CustomeForm
                data={[
                  {
                    master_tracking_number_id: '',
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
  <MainLayout
    title='Approval Route Tracking Number Choose'
    description='Approval Route Tracking Number Choose Create'
  >
    {page}
  </MainLayout>
);

export default Create;
