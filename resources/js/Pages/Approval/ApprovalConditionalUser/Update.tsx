import MainLayout from '@/Pages/Layouts/MainLayout';
import axiosInstance from '@/axiosInstance';
import FormMapping from '@/components/form/FormMapping';
import { DETAIL_APPROVAL_ROUTE, EDIT_APPROVAL_ROUTE } from '@/endpoint/approvalRoute/api';
import { LIST_PAGE_APPROVAL_ROUTE } from '@/endpoint/approvalRoute/page';
import { usePage } from '@inertiajs/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomeForm from './model/customeForm';
import { formModel } from './model/formModel';
import {
  DETAIL_APPROVAL_CONDITIONAL_USER,
  EDIT_APPROVAL_CONDITIONAL_USER,
} from '@/endpoint/settingApprovalPrConditionalUser/api';
import { LIST_PAGE_APPROVAL_CONDITIONAL_USER } from '@/endpoint/settingApprovalPrConditionalUser/page';

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
        const response = await axiosInstance.get(DETAIL_APPROVAL_CONDITIONAL_USER(props.id));
        const data = response.data;
        methods.reset(data.data);
        setDataApproval(data.data.routes ?? []);
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
            url={`${EDIT_APPROVAL_CONDITIONAL_USER}/${props.id}`}
            redirectUrl={LIST_PAGE_APPROVAL_CONDITIONAL_USER}
            formLogic={<CustomeForm data={dataApproval} />}
          />
        </div>
      </div>
    </>
  );
};

// Assign layout to the page
Update.layout = (page: ReactNode) => (
  <MainLayout title='Approval Route' description='Approval Route Update'>
    {page}
  </MainLayout>
);

export default Update;
