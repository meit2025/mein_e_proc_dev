import axiosInstance from '@/axiosInstance';
import { Loading } from '@/components/commons/Loading';
import FormMapping from '@/components/form/FormMapping';
import TransferList from '@/components/Input/formTransferList';
import {
  CREATE_APPROVAL_USER_DROPDOWN_ROUTE,
  DETAIL_APPROVAL_USER_DROPDOWN_ROUTE,
} from '@/endpoint/approvalRoute/api';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const UserAssigmentLayout = ({ id, data }: { id: number; data: any }) => {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [leftData, setLeftData] = useState([]);
  const [rightData, setRightData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getdetail = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get(DETAIL_APPROVAL_USER_DROPDOWN_ROUTE(id));
      const data = response.data;
      setLeftData(data.data.users);
      setRightData(data.data.data);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getdetail();
  }, [getdetail]);

  const handleTransfer = (left: readonly any[], right: readonly any[]) => {
    const mapRight = right.map((item) => item.value);
    methods.reset({
      approval_route_id: id,
      user_ids: mapRight,
    });
  };

  return (
    <div className='card card-grid h-full min-w-full p-4'>
      <Loading isLoading={isLoading} />
      <div className='card-body'>
        <FormMapping
          url={CREATE_APPROVAL_USER_DROPDOWN_ROUTE}
          methods={methods}
          isCustom={true}
          formCustom={
            <div style={{ padding: 20 }}>
              <TransferList
                leftItems={leftData}
                rightItems={rightData}
                onTransfer={handleTransfer}
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default UserAssigmentLayout;
