import axiosInstance from '@/axiosInstance';
import { Loading } from '@/components/commons/Loading';
import FormMapping from '@/components/form/FormMapping';
import FormTextArea from '@/components/Input/formTextArea';
import { Auth } from '@/Pages/Layouts/Header';
import { usePage } from '@inertiajs/react';
import { Box, Modal } from '@mui/material';
import Button from '@mui/material/Button';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DetailApproval from './detailApproval';
import moment from 'moment';

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
const LayoutApproval = ({
  id,
  children,
  type,
  status_id,
}: {
  id: any;
  children: ReactNode;
  type: string;
  status_id?: number;
}) => {
  const { props } = usePage();
  const { auth } = usePage().props as unknown as { auth?: Auth };

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproval, setIsApproval] = useState(false);
  const [open, setOpen] = useState(false);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          '/api/approval/route/getApproval?id=' + id + '&type=' + type,
        );
        const data = response.data;
        methods.reset(data.data.data);

        const approvalRequest = (data.data ?? []).map(
          (route: any) => route.user.divisions?.name || null,
        );

        const approvalFrom = (data.data ?? []).map((route: any) => route.user.name);
        const firstFalseStatus = (data.data ?? []).find((item: any) => item.is_status === false);

        if (
          status_id !== 4 &&
          status_id !== 2 &&
          status_id !== 6 &&
          firstFalseStatus?.user_id === auth?.user?.id
        ) {
          setIsApproval(true);
        }
        const approvalFromStatusRoute = (data.data ?? []).map((route: any) => {
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
        methods.setValue('function_name', type.toLowerCase());
        methods.setValue('type', type.toLowerCase());
        methods.setValue('id', id);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    [id, type, methods, status_id, auth?.user?.id], // Include `methods` in the dependency array
  );

  useEffect(() => {
    getdetail();
  }, [getdetail, status_id]);

  useEffect(() => {
    if (status_id === 4 || status_id === 6 || status_id === 2) {
      setIsApproval(false);
    }
  }, [status_id]);

  const handleClose = () => {
    setOpen(false);
    methods.setValue('note', '');
    methods.setValue('id_approval', '');
    methods.setValue('status', '');
    methods.setValue('type', '');
  };
  const handleOpen = (status: string) => {
    setOpen(true);
    methods.setValue('status', status);
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

        {children}

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
                <>
                  <FormTextArea
                    fieldLabel={'note'}
                    fieldName={'note'}
                    isRequired={true}
                    requiredMessage={''}
                    rows={20}
                    style={{ width: '100%' }}
                  />
                </>
              }
              methods={methods}
              url={'api/approval/approval_or_rejceted'}
            />
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default LayoutApproval;
