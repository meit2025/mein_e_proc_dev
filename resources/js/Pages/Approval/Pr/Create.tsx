import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { CREATE_SETTING_APPROVAL_PR } from '@/endpoint/settingApprovalPr/api';
import { LIST_PAGE_SETTING_APPROVAL_PR } from '@/endpoint/settingApprovalPr/page';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomeForm from './model/customeForm';
import { formModel } from './model/formModel';
import useDropdownOptionsArray from '@/lib/getDropdownArray';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
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
            url={CREATE_SETTING_APPROVAL_PR}
            redirectUrl={LIST_PAGE_SETTING_APPROVAL_PR}
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
  <MainLayout title='Approval Route PR' description='Approval Route PR Create'>
    {page}
  </MainLayout>
);

export default Create;
