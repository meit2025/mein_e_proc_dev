import { ReactNode } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { useForm } from 'react-hook-form';
import { CREATE_PR } from '@/endpoint/purchaseRequisition/api';
import { LIST_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import CustomeForm from './model/customeForm';
import PageOne from './model/pageOne';

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
            isCustom={true}
            formCustom={<PageOne item={[]} vendor={[]} />}
            methods={methods}
            url={CREATE_PR}
            redirectUrl={LIST_PAGE_PR}
          />
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Purchase Requisition' description='Purchase Requisition Create'>
    {page}
  </MainLayout>
);

export default Create;
