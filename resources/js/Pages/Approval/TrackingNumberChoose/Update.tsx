import MainLayout from '@/Pages/Layouts/MainLayout';
import axiosInstance from '@/axiosInstance';
import FormMapping from '@/components/form/FormMapping';
import {
  DETAIL_SETTING_APPROVAL_PR,
  EDIT_SETTING_APPROVAL_PR,
} from '@/endpoint/settingApprovalPr/api';
import { LIST_PAGE_SETTING_APPROVAL_PR } from '@/endpoint/settingApprovalPr/page';
import { usePage } from '@inertiajs/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomeForm from './model/customeForm';
import { formModel } from './model/formModel';
import {
  DETAIL_TRACKING_NUMBER_CHOOSE,
  EDIT_TRACKING_NUMBER_CHOOSE,
} from '@/endpoint/approvalTrackingNumberChoose/api';
import { LIST_PAGE_TRACKING_NUMBER_CHOOSE } from '@/endpoint/approvalTrackingNumberChoose/page';

const Update = ({ id }: { id: number }) => {
  const { props } = usePage();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataApproval, setDataApproval] = useState<any[]>([]);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_TRACKING_NUMBER_CHOOSE(props.id));
        const data = response.data;
        methods.reset(data.data);
        setDataApproval(data.data.approval_tracking_number_route ?? []);
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
  }, [getdetail]);

  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            isLoading={isLoading}
            methods={methods}
            formModel={formModel}
            url={`${EDIT_TRACKING_NUMBER_CHOOSE}/${props.id}`}
            redirectUrl={LIST_PAGE_TRACKING_NUMBER_CHOOSE}
            formLogic={<CustomeForm data={dataApproval} />}
          />
        </div>
      </div>
    </>
  );
};

// Assign layout to the page
Update.layout = (page: ReactNode) => (
  <MainLayout
    title='Approval Route  Tracking Number Choose'
    description='Approval Route  Tracking Number Choose Update'
  >
    {page}
  </MainLayout>
);

export default Update;
