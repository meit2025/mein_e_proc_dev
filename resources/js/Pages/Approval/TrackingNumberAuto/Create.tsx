import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { CREATE_TRACKING_NUMBER_AUTO } from '@/endpoint/approvalTrackingNumberAuto/api';
import { LIST_PAGE_TRACKING_NUMBER_AUTO } from '@/endpoint/approvalTrackingNumberAuto/page';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import useDropdownOptionsArray from '@/lib/getDropdownArray';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formModel } from './model/formModel';
import { modelDropdowns } from './model/modelDropdowns';

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
            url={CREATE_TRACKING_NUMBER_AUTO}
            redirectUrl={LIST_PAGE_TRACKING_NUMBER_AUTO}
          />
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout
    title='Approval Route Tracking Number Auto'
    description='Approval Route Tracking Number Auto Create'
  >
    {page}
  </MainLayout>
);

export default Create;
