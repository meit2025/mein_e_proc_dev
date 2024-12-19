import axiosInstance from '@/axiosInstance';
import { Loading } from '@/components/commons/Loading';
import {
  WorkflowApprovalDiagramInterface,
  WorkflowApprovalStepInterface,
  WorkflowComponent,
} from '@/components/commons/WorkflowComponent';
import FormAutocomplete from '@/components/Input/formDropdown';
import { useAlert } from '@/contexts/AlertContext';
import useDropdownOptions from '@/lib/getDropdown';
import { Button } from '@mui/material';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const CheckApproval = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { getValues, watch, setValue } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [approvalRoute, setApprovalRoute] = useState({
    approvalRequest: [],
    approvalFrom: [],
    acknowledgeFrom: [],
  });
  const { dataDropdown, getDropdown } = useDropdownOptions();

  const { showToast } = useAlert();
  const dokumnentType = watch('document_type');
  const metodeApproval = watch('metode_approval');

  const fetchDataValue = async () => {
    try {
      const getData = getValues();

      const dataVendorArray = getValues('vendors').filter(
        (item: any) => (item.winner || false) === true,
      );

      const dataVendor = dataVendorArray.length > 0 ? dataVendorArray[0] : null;

      if (dataVendor === null || dataVendor === undefined) {
        setLoading(false);
        showToast('Please Select Vendor Winner', 'error');
        return;
      }

      const winnerUnit = dataVendor?.units || [];
      const totalSum = winnerUnit.reduce((sum: number, item: any) => sum + item.total_amount, 0);
      setValue('total_all_amount', totalSum);

      if (getData.document_type === null || getData.document_type === undefined) {
        setLoading(false);
        showToast('Please input Document Type', 'error');
        return;
      }

      if (getData.purchasing_groups === null || getData.purchasing_groups === undefined) {
        setLoading(false);
        showToast('Please input purchasing group', 'error');
        return;
      }

      if (getData.total_all_amount === null || getData.total_all_amount === undefined) {
        setLoading(false);
        showToast('Please input Item', 'error');
        return;
      }
      if (getData.user_id === null || getData.user_id === undefined) {
        setLoading(false);
        showToast('Please input Item', 'error');
        return;
      }

      if (getData.document_type === 'ZENT') {
        if (getData.metode_approval === null || getData.metode_approval === undefined) {
          setLoading(false);
          showToast('Please select metode approval', 'error');
          return;
        }

        if (
          getData.metode_approval === 'chooses_approval' &&
          (getData.chooses_approval_id === null || getData.chooses_approval_id === undefined)
        ) {
          setLoading(false);
          showToast('Please select chooses approval', 'error');
          return;
        }
      }

      const response = await axiosInstance.get('/check-approval', {
        params: {
          document_type_id: getData.document_type,
          purchasing_group_id: getData.purchasing_groups,
          value: totalSum,
          user_id: getData.user_id,
          type: 'PR',
          metode_approval: getData.metode_approval,
          chooses_approval_id: getData.chooses_approval_id,
        },
      });
      if (response.data.status_code === 200) {
        const approvalRequest = response.data?.data?.approval_route.map(
          (route: any) => route.user.divisions?.name || null,
        );

        const approvalFrom = response.data?.data?.approval_route.map(
          (route: any) => route.user.name,
        );
        setApprovalRoute({
          approvalRequest,
          approvalFrom,
          acknowledgeFrom: [],
        });
        setIsShow(true);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsShow(false);
      if (error instanceof AxiosError && error.response) {
        const message = error.response.data?.message || 'An unexpected error occurred';
        showToast(message, 'error');
      } else if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('An unexpected error occurred', 'error');
      }
    }
  };

  useEffect(() => {
    getDropdown('', {
      name: 'name',
      id: 'id',
      tabel: 'approval_tracking_number_chooses',
    });
  }, []);

  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <Loading isLoading={loading} />
        <div className='card-body'>
          <div className='flex justify-start mt-4 mb-2'>
            <Button
              onClick={async () => await fetchDataValue()}
              variant='contained'
              color='primary'
              type='button'
            >
              Check Approval
            </Button>
          </div>
          {dokumnentType === 'ZENT' && (
            <>
              <FormAutocomplete<any>
                options={[
                  {
                    label: 'Approval',
                    value: 'approval',
                  },
                  {
                    label: 'Chooses Approval Tracking Number',
                    value: 'chooses_approval',
                  },
                  {
                    label: 'Automatic Approval Tracking Number',
                    value: 'automatic_approval_by_purchasing_group',
                  },
                ]}
                fieldLabel={'Metode Approval'}
                fieldName={'metode_approval'}
                disabled={false}
                style={{
                  width: '58.5rem',
                }}
                placeholder={'Metode Approval'}
                classNames='mt-2'
              />
              {metodeApproval === 'chooses_approval' && (
                <FormAutocomplete<any>
                  options={dataDropdown}
                  fieldLabel={'Select Chooses approval'}
                  fieldName={'chooses_approval_id'}
                  isRequired={true}
                  disabled={false}
                  style={{
                    width: '58.5rem',
                  }}
                  placeholder={'Select Chooses approval'}
                  classNames='mt-2'
                />
              )}
            </>
          )}
          {isShow && (
            <WorkflowComponent
              workflowApproval={{
                approvalRequest: approvalRoute.approvalRequest,
                approvalFrom: approvalRoute.approvalFrom,
                acknowledgeFrom: approvalRoute.acknowledgeFrom,
              }}
              workflowApprovalStep={
                approvalRoute.approvalFrom as unknown as WorkflowApprovalStepInterface
              }
              workflowApprovalDiagram={
                approvalRoute.approvalFrom as unknown as WorkflowApprovalDiagramInterface
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CheckApproval;
