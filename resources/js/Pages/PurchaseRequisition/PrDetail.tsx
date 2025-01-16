import { ReactNode, useCallback, useEffect, useState } from 'react';
import FormMapping from '@/components/form/FormMapping';
import useDropdownOptionsArray from '@/lib/getDropdownArray';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/axiosInstance';
import { usePage } from '@inertiajs/react';
import { DETAIL_PR, EDIT_PR } from '@/endpoint/purchaseRequisition/api';
import { LIST_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import { modelDropdowns } from './model/modelDropdown';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import { Loading } from '@/components/commons/Loading';
import { formModelEdit } from './model/formModelEdit';
import Button from '@mui/material/Button';
import { Auth } from '../Layouts/Header';
import { Box, Modal } from '@mui/material';
import FormTextArea from '@/components/Input/formTextArea';
import DetailApproval from '@/components/approval/detailApproval';
import moment from 'moment';
import { CustomStatus } from '@/components/commons/CustomStatus';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  pt: 2,
  px: 4,
  pb: 3,
};
const PrDetail = ({ id }: { id: number }) => {
  const { props } = usePage();
  const { auth } = usePage().props as unknown as { auth?: Auth };

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [dataModel, setDataModel] = useState(formModelEdit);
  const [isApproval, setIsApproval] = useState(false);
  const [open, setOpen] = useState(false);
  const { dropdownOptions, getDropdown } = useDropdownOptionsArray();

  useEffect(() => {
    getDropdown(modelDropdowns, formModelEdit);
  }, []);

  useEffect(() => {
    setDataModel(dropdownOptions as FormFieldModel<any>[]);
  }, [dropdownOptions]);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_PR(props.id));
        const data = response.data;
        methods.reset(data.data.data);

        const approvalRequest = (data.data?.approval ?? []).map(
          (route: any) => route.user.divisions?.name || null,
        );

        const approvalFrom = (data.data?.approval ?? []).map((route: any) => route.user.name);
        const firstFalseStatus = (data.data?.approval ?? []).find(
          (item: any) => item.is_status === false,
        );

        if (
          data.data?.data?.status_id !== 4 &&
          data.data?.data?.status_id !== 2 &&
          data.data?.data?.status_id !== 6 &&
          firstFalseStatus?.user_id === auth?.user?.id
        ) {
          setIsApproval(true);
        }

        const approvalFromStatusRoute = (data.data?.approval ?? []).map((route: any) => {
          return {
            status: route.status,
            name: route.user.name,
            dateApproved: moment(route.updated_at).format('YYYY-MM-DD'),
            note: route.message,
          };
        });

        methods.setValue('approvalFromStatusRoute', approvalFromStatusRoute);
        methods.setValue('approvalRequest', approvalRequest);
        methods.setValue('approvalFrom', approvalFrom);
        methods.setValue('approvalId', firstFalseStatus?.id);
        methods.setValue('function_name', 'procurement');
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    [methods, props.id], // Include `methods` in the dependency array
  );

  useEffect(() => {
    getdetail();
  }, [getdetail]);

  const handleClose = () => {
    setOpen(false);
    methods.setValue('note', '');
    methods.setValue('id_approval', '');
    methods.setValue('status', '');
  };
  const handleOpen = (status: string) => {
    setOpen(true);
    methods.setValue('status', status);
    methods.setValue('type', 'procurement');
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='card card-grid h-full min-w-full p-4'>
        {isApproval && (
          <div className='card-header'>
            <div>
              <Button
                variant='contained'
                onClick={() => handleOpen('Approved')}
                color='primary'
                type='button'
              >
                APPROVE
              </Button>
              <Button
                onClick={() => handleOpen('Revise')}
                style={{
                  marginLeft: '1rem',
                }}
                variant='contained'
                color='warning'
                type='button'
              >
                Revise
              </Button>
              <Button
                onClick={() => handleOpen('Rejected')}
                style={{
                  marginLeft: '1rem',
                }}
                variant='contained'
                color='error'
                type='button'
              >
                REJECT
              </Button>
            </div>
          </div>
        )}

        <div className='w-full'>
          <div className='flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
            <label className='form-label max-w-40'>{'Status'}</label>
            <CustomStatus
              name={methods.watch('status.name')}
              className={methods.watch('status.classname')}
              code={methods.watch('status.code')}
            />
          </div>
        </div>

        <div className='w-full mt-4'>
          <div className='flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
            <label className='form-label max-w-40'>{'Request By'}</label>
            {methods.watch('created_by.name')}
          </div>
        </div>

        <div className='w-full mt-4'>
          <div className='flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
            <label className='form-label max-w-40'>{'Purchase Number'}</label>
            {methods.watch('purchases_number')}
          </div>
        </div>

        <div className='card-body'>
          <FormMapping
            formModel={dataModel}
            methods={methods}
            url={''}
            redirectUrl={LIST_PAGE_PR}
            disableButtonSubmit={true}
          />
        </div>
        <DetailApproval methods={methods} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='parent-modal-title'
          aria-describedby='parent-modal-description'
        >
          <Box sx={{ ...style, width: 900 }}>
            <FormMapping
              isCustom={true}
              formCustom={
                <FormTextArea
                  fieldLabel={'note'}
                  fieldName={'note'}
                  isRequired={true}
                  requiredMessage={''}
                  rows={20}
                  style={{ width: '100%' }}
                />
              }
              formModel={dataModel}
              methods={methods}
              url={'api/approval/approval_or_rejceted'}
              redirectUrl={LIST_PAGE_PR}
            />
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default PrDetail;
