import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { formModel } from './model/formModel';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/axiosInstance';
import { usePage } from '@inertiajs/react';
import {
  DETAIL_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
  EDIT_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
} from '@/endpoint/accountAssignmentCategory/api';
import { LIST_PAGE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY } from '@/endpoint/accountAssignmentCategory/page';
import { DETAIL_APPROVAL_ROUTE, EDIT_APPROVAL_ROUTE } from '@/endpoint/approvalRoute/api';
import { LIST_PAGE_APPROVAL_ROUTE } from '@/endpoint/approvalRoute/page';
import CustomeForm from './model/customeForm';

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
        const response = await axiosInstance.get(DETAIL_APPROVAL_ROUTE(props.id));
        const data = response.data;
        methods.reset(data.data);
        setDataApproval(data.data.user_approvals ?? []);
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
            url={`${EDIT_APPROVAL_ROUTE}/${props.id}`}
            redirectUrl={LIST_PAGE_APPROVAL_ROUTE}
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
