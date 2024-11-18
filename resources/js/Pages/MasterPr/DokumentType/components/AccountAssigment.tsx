import FormMapping from '@/components/form/FormMapping';
import TransferList from '@/components/Input/formTransferList';
import { CREATE_MASTER_DROPDOWN } from '@/endpoint/dokumentType copy/api';
import useDataDropdown from '@/lib/getDataDropdown';
import useDropdownOptions from '@/lib/getDropdown';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const AccountAssigmentLayout = ({ id, data }: { id: number; data: any }) => {
  const { dataDropdown: accountAssignment, getDropdown: getAccountAssignment } =
    useDropdownOptions();
  const { dataDropdown: dataRight, getDropdown: getDataRight } = useDataDropdown();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handleTransfer = (left: readonly any[], right: readonly any[]) => {
    const mapRight = right.map((item) => item.value);
    methods.reset({
      doc_id: id,
      dropdown_type: 'dokumeType',
      tabel_name: 'account_assignment_categories',
      field_name: data?.purchasing_doc,
      data_dropdown: mapRight.join(','),
    });
    if (dataRight && typeof dataRight === 'object') {
      dataRight.data_dropdown = mapRight.join(',');
    } else {
      console.warn('dataRight is null or invalid, cannot set data_dropdown.');
    }
  };

  useEffect(() => {
    getAccountAssignment('', {
      name: 'description',
      id: 'account',
      tabel: 'account_assignment_categories',
    });
    getDataRight({
      id: id,
      type: 'dokumeType',
      search: data?.purchasing_doc,
    });
  }, [data]);

  return (
    <div className='card card-grid h-full min-w-full p-4'>
      <div className='card-body'>
        <FormMapping
          url={CREATE_MASTER_DROPDOWN}
          methods={methods}
          isCustom={true}
          formCustom={
            <div style={{ padding: 20 }}>
              <TransferList
                leftItems={accountAssignment.filter(
                  (item) => !dataRight?.data_dropdown.split(',').includes(item.value),
                )}
                rightItems={accountAssignment.filter((item) =>
                  dataRight?.data_dropdown.split(',').includes(item.value),
                )}
                onTransfer={handleTransfer}
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default AccountAssigmentLayout;
