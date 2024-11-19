import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormMapping from '@/components/form/FormMapping';
import FormAutocomplete from '@/components/Input/formDropdown';
import TransferList from '@/components/Input/formTransferList';
import { CREATE_MASTER_DROPDOWN } from '@/endpoint/dokumentType copy/api';
import useDataDropdown from '@/lib/getDataDropdown';
import useDropdownOptions from '@/lib/getDropdown';
import useDataTabel from '@/lib/getDataTabel';
import { formDropdownTabel } from '../model/formModel';

export const PermissionDropdownLayout = ({ id }: { id: number }) => {
  const { dataDropdown: dataRight, getDropdown: getDataRight } = useDataDropdown();
  const { dataDropdown: dataList, getDropdown: getDataList } = useDropdownOptions();

  const [leftItems, setLeftItems] = useState<any[]>([]);
  const [rightItems, setRightItems] = useState<any[]>([]);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handleTransfer = (left: readonly any[], right: readonly any[]) => {
    const mapRight = right.map((item) => item.value);

    methods.setValue('doc_id', id);
    methods.setValue('dropdown_type', 'role_dropdown_permission');
    methods.setValue('data_dropdown', mapRight.join(',') === '' ? '0' : mapRight.join(','));

    if (dataRight && typeof dataRight === 'object') {
      dataRight.data_dropdown = mapRight.join(',');
    } else {
      console.warn('dataRight is null or invalid, cannot set data_dropdown.');
    }
  };

  const handleMaterialNumber = async (search: string) => {
    // Fetch material numbers and data right based on search
    const result: string[] = search.split(',');
    await getDataList('', {
      name: result[1],
      id: result[2],
      tabel: result[0],
    });
    methods.setValue('tabel_name', result[0]);

    if (dataRight && typeof dataRight === 'object') {
      dataRight.data_dropdown = '';
    } else {
      console.warn('dataRight is null or invalid, cannot set data_dropdown.');
    }

    await getDataRight({
      id: id,
      type: 'role_dropdown_permission',
      search: search,
    });
  };

  useEffect(() => {
    if (!dataList || !dataRight) return;

    const dataRightValues = dataRight?.data_dropdown ? dataRight.data_dropdown.split(',') : [];
    console.log(dataRightValues);

    // Update left and right items based on fetched data
    const updatedLeftItems = dataList.filter((item) => !dataRightValues.includes(`${item.value}`));
    const updatedRightItems = dataList.filter((item) => dataRightValues.includes(`${item.value}`));

    setLeftItems(updatedLeftItems);
    setRightItems(updatedRightItems);
  }, [dataList, dataRight]);

  return (
    <div className='card card-grid h-full min-w-full p-4'>
      <div className='card-body'>
        <FormMapping
          url={CREATE_MASTER_DROPDOWN}
          methods={methods}
          isCustom={true}
          formCustom={
            <div style={{ padding: 20 }}>
              <div
                style={{
                  marginBottom: '1rem',
                }}
              >
                <FormAutocomplete<any>
                  options={formDropdownTabel}
                  fieldLabel={'Select tabel'}
                  fieldName={'field_name'}
                  isRequired={true}
                  disabled={false}
                  style={{
                    width: '58.5rem',
                  }}
                  placeholder={'Select Material Group'}
                  classNames='mt-2 mb-2'
                  onChangeOutside={async (x: string, data: any) => {
                    await handleMaterialNumber(x);
                  }}
                />
              </div>
              <TransferList
                leftItems={leftItems}
                rightItems={rightItems}
                onTransfer={handleTransfer}
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default PermissionDropdownLayout;
