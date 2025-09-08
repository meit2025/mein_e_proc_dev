import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormMapping from '@/components/form/FormMapping';
import FormAutocomplete from '@/components/Input/formDropdown';
import TransferList from '@/components/Input/formTransferList';
import { CREATE_MASTER_DROPDOWN } from '@/endpoint/dokumentType copy/api';
import useDataDropdown from '@/lib/getDataDropdown';
import useDropdownOptions from '@/lib/getDropdown';

export const MaterialNumberLayout = ({ id }: { id: number }) => {
  const { dataDropdown: materialGroup, getDropdown: getMaterialGroup } = useDropdownOptions();
  const { dataDropdown: materialNumber, getDropdown: getMaterialNumber } = useDropdownOptions();
  const { dataDropdown: dataRight, getDropdown: getDataRight } = useDataDropdown();

  const [leftItems, setLeftItems] = useState<any[]>([]);
  const [rightItems, setRightItems] = useState<any[]>([]);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handleTransfer = (left: readonly any[], right: readonly any[]) => {
    const mapRight = right.map((item) => item.value);

    methods.setValue('doc_id', id);
    methods.setValue('dropdown_type', 'dokumeType_material_group');
    methods.setValue('tabel_name', 'material_group');
    methods.setValue('data_dropdown', mapRight.join(',') === '' ? '0' : mapRight.join(','));

    if (dataRight && typeof dataRight === 'object') {
      dataRight.data_dropdown = mapRight.join(',');
    } else {
      console.warn('dataRight is null or invalid, cannot set data_dropdown.');
    }
  };

  useEffect(() => {
    // Fetch material groups on mount
    getMaterialGroup('', {
      name: 'material_group_desc',
      id: 'material_group',
      tabel: 'material_groups',
    });
  }, []);

  const handleMaterialNumber = async (search: string) => {
    // Fetch material numbers and data right based on search
    await getMaterialNumber('', {
      name: 'material_number',
      id: 'id',
      tabel: 'master_materials',
      where: {
        key: 'material_group',
        parameter: search,
      },
    });

    await getDataRight({
      id: id,
      type: 'dokumeType_material_group',
      search: search,
    });
  };

  useEffect(() => {
    if (!materialNumber || !dataRight) return;

    const dataRightValues = dataRight?.data_dropdown ? dataRight.data_dropdown.split(',') : [];

    console.log('dataRightValues', dataRightValues);
    // Update left and right items based on fetched data
    const updatedLeftItems = materialNumber.filter(
      (item) => !dataRightValues.includes(`${item.value}`),
    );
    const updatedRightItems = materialNumber.filter((item) =>
      dataRightValues.includes(`${item.value}`),
    );

    console.log(updatedRightItems);
    setLeftItems(updatedLeftItems);
    setRightItems(updatedRightItems);
  }, [materialNumber, dataRight]);

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
                  options={materialGroup}
                  fieldLabel={'Select Material Number'}
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

export default MaterialNumberLayout;
