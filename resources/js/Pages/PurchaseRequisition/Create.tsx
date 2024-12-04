import { ReactNode, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { useForm } from 'react-hook-form';
import { CREATE_PR } from '@/endpoint/purchaseRequisition/api';
import { LIST_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import { formModel } from './model/formModel';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import useDropdownOptionsArray from '@/lib/getDropdownArray';
import { modelDropdowns } from './model/modelDropdown';
import { usePage, Link } from '@inertiajs/react';
import { Auth } from '../Layouts/Header';

function Create() {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [dataModel, setDataModel] = useState(formModel);
  const { dropdownOptions, getDropdown } = useDropdownOptionsArray();
  const { auth } = usePage().props as unknown as { auth?: Auth };

  useEffect(() => {
    getDropdown(modelDropdowns, formModel);
  }, []);

  useEffect(() => {
    console.log(auth);
    if (auth?.user?.is_admin !== '1') {
      const updatedObject = (dropdownOptions ?? []).map((field) =>
        field.name === 'user_id' ? { ...field, disabled: true } : field,
      );
      methods.setValue('user_id', auth?.user?.id);
      setDataModel(updatedObject);
    } else {
      setDataModel(dropdownOptions as FormFieldModel<any>[]);
    }
  }, [dropdownOptions]);

  return (
    <div className='card card-grid h-full min-w-full p-4'>
      <div className='card-body'>
        <FormMapping
          formModel={dataModel}
          methods={methods}
          url={CREATE_PR}
          redirectUrl={LIST_PAGE_PR}
        />
      </div>
    </div>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Purchase Requisition' description='Purchase Requisition Create'>
    {page}
  </MainLayout>
);

export default Create;
