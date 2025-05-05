import axiosInstance from '@/axiosInstance';
import { Loading } from '@/components/commons/Loading';
import FormMapping from '@/components/form/FormMapping';
import FormAutocomplete from '@/components/Input/formDropdown';
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

  console.log('data', data);

  const [type, setType] = useState<string>('reim');
  const [leftData, setLeftData] = useState([]);
  const [rightData, setRightData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  const getdetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(DETAIL_APPROVAL_USER_DROPDOWN_ROUTE(id, type));
      const data = response.data;
      setLeftData(data.data.users);
      setRightData(data.data.data);
    } finally {
      setIsLoading(false);
    }
  }, [id, type]);

  useEffect(() => {
    getdetail();
  }, [id, type, getdetail]);

  useEffect(() => {
    if (data?.is_bt && data.is_reim) {
      setType('reim');
      setOptions([
        {
          label: 'Business Trip',
          value: 'bt',
        },
        {
          label: 'Reimbursement',
          value: 'reim',
        },
      ]);
    } else if (data?.is_bt) {
      setType('bt');
      setOptions([
        {
          label: 'Business Trip',
          value: 'bt',
        },
      ]);
    } else if (data?.is_reim) {
      setType('reim');
      setOptions([
        {
          label: 'Reimbursement',
          value: 'reim',
        },
      ]);
    }
  }, [data]);

  const handleTransfer = (left: readonly any[], right: readonly any[]) => {
    const mapRight = right.map((item) => item.value);
    methods.reset({
      type: type,
      approval_route_id: id,
      user_ids: mapRight,
    });
  };

  if (data?.is_bt) {
    options.push();
  }

  if (data?.is_reim) {
    options.push();
  }

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
              <FormAutocomplete
                fieldLabel='Approval'
                fieldName='type'
                onChangeOutside={(value) => {
                  setType(value ?? 'reim');
                }}
                style={{
                  width: '60.5rem',
                  marginBottom: '1rem',
                }}
                options={options}
              />
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
