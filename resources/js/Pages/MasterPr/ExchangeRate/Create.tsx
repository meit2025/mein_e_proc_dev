import { ReactNode, useEffect } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { formModel, modelDropdowns } from './model/formModel';
import { useForm } from 'react-hook-form';
import { CREATE_MASTER_EXCHANGERATE } from '@/endpoint/exchangeRate/api';
import { LIST_PAGE_MASTER_EXCHANGERATE } from '@/endpoint/exchangeRate/page';
import useDropdownOptionsArray from '@/lib/getDropdownArray';

function Create() {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { dropdownOptions, getDropdown } = useDropdownOptionsArray();
  useEffect(() => {
    getDropdown(modelDropdowns, formModel);
  }, []);

  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            methods={methods}
            formModel={dropdownOptions}
            url={CREATE_MASTER_EXCHANGERATE}
            redirectUrl={LIST_PAGE_MASTER_EXCHANGERATE}
          />
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Exchange Rate' description='Exchange Rate Create'>
    {page}
  </MainLayout>
);

export default Create;
