import MainLayout from '@/Pages/Layouts/MainLayout';
import axiosInstance from '@/axiosInstance';
import FormMapping from '@/components/form/FormMapping';
import {
  DETAIL_SETTING_APPROVAL_PR,
  EDIT_SETTING_APPROVAL_PR,
} from '@/endpoint/settingApprovalPr/api';
import { LIST_PAGE_SETTING_APPROVAL_PR } from '@/endpoint/settingApprovalPr/page';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import useDropdownOptionsArray from '@/lib/getDropdownArray';
import { usePage } from '@inertiajs/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formModel } from './model/formModel';
import { modelDropdowns } from './model/modelDropdowns';
import {
  DETAIL_TRACKING_NUMBER_AUTO,
  GET_TRACKING_NUMBER_AUTO,
} from '@/endpoint/approvalTrackingNumberAuto/api';
import { LIST_PAGE_TRACKING_NUMBER_AUTO } from '@/endpoint/approvalTrackingNumberAuto/page';

const Update = ({ id }: { id: number }) => {
  const { props } = usePage();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataApproval, setDataApproval] = useState<any[]>([]);
  const { dropdownOptions, getDropdown } = useDropdownOptionsArray();
  const [dataModel, setDataModel] = useState(formModel);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_TRACKING_NUMBER_AUTO(props.id));
        const data = response.data;
        methods.reset(data.data);
        setDataApproval(data.data.approval_route ?? []);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [methods, props.id], // Include `methods` in the dependency array
  );

  useEffect(() => {
    getdetail();
    getDropdown(modelDropdowns, formModel);
  }, [getdetail]);

  useEffect(() => {
    setDataModel(dropdownOptions as FormFieldModel<any>[]);
  }, [dropdownOptions]);

  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            isLoading={isLoading}
            methods={methods}
            formModel={dataModel}
            url={`${GET_TRACKING_NUMBER_AUTO}/${props.id}`}
            redirectUrl={LIST_PAGE_TRACKING_NUMBER_AUTO}
          />
        </div>
      </div>
    </>
  );
};

// Assign layout to the page
Update.layout = (page: ReactNode) => (
  <MainLayout
    title='Approval Route Tracking Number Auto'
    description='Approval Route Tracking Number Auto Update'
  >
    {page}
  </MainLayout>
);

export default Update;
