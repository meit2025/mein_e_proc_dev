import FormMapping from '@/components/form/FormMapping';
import { CREATE_USER } from '@/endpoint/user/api';
import { LIST_PAGE_USER } from '@/endpoint/user/page';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import useDropdownOptionsArray from '@/lib/getDropdownArray';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formModel } from './model/formModel';
import { modelDropdowns } from './model/modelDropdown';

function Create() {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [dataModel, setDataModel] = useState(formModel);
  const { dropdownOptions, getDropdown } = useDropdownOptionsArray();
  useEffect(() => {
    getDropdown(modelDropdowns, formModel);
  }, []);

  useEffect(() => {
    setDataModel(dropdownOptions as FormFieldModel<any>[]);
  }, [dropdownOptions]);
  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            methods={methods}
            formModel={dataModel}
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
