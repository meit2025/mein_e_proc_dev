import FormAutocomplete from '@/components/Input/formDropdown';
import FormInput from '@/components/Input/formInput';
import FormTextArea from '@/components/Input/formTextArea';
import useDropdownOptions from '@/lib/getDropdown';
import { useEffect } from 'react';

const ArrayForm = ({ dataIndex }: { dataIndex: number }) => {
  const { dataDropdown: costCenter, getDropdown: getCostCenter } = useDropdownOptions();
  const { dataDropdown: dataVendor, getDropdown: getVendor } = useDropdownOptions();
  const { dataDropdown: dataMaterial, getDropdown: getMaterialNumber } = useDropdownOptions();
  const { dataDropdown: dataMaterialGroup, getDropdown: getMaterialGroup } = useDropdownOptions();
  const { dataDropdown: dataTax, getDropdown: getTax } = useDropdownOptions();
  const { dataDropdown: dataUom, getDropdown: getUom } = useDropdownOptions();

  useEffect(() => {
    getCostCenter('', { name: 'cost_center', id: 'id', tabel: 'master_cost_centers' });
    getVendor('', { name: 'name_one', id: 'id', tabel: 'master_business_partners' });
    getMaterialNumber('', {
      name: 'material_number',
      id: 'material_number',
      tabel: 'master_materials',
    });
    getMaterialGroup('', {
      name: 'material_group_desc',
      id: 'material_group',
      tabel: 'material_groups',
    });
    getTax('', {
      name: 'description',
      id: 'mwszkz',
      tabel: 'pajaks',
    });
    getUom('', {
      name: 'unit_of_measurement_text',
      id: 'commercial',
      tabel: 'uoms',
    });
  }, []);
  return (
    <div>
      <FormAutocomplete<any[]>
        options={dataVendor}
        fieldLabel={'Select Vendor'}
        fieldName={`item[${dataIndex}].vendor`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Select Vendor'}
        classNames='mt-2'
      />

      <FormAutocomplete<any[]>
        options={costCenter}
        fieldLabel={'Cost Center'}
        fieldName={`item[${dataIndex}].material_number`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Cost Center'}
        classNames='mt-2'
      />

      <FormAutocomplete<any[]>
        options={dataMaterialGroup}
        fieldLabel={'Material Group'}
        fieldName={`item[${dataIndex}].material_group`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Material Group'}
        classNames='mt-2'
      />
      <FormAutocomplete<any[]>
        options={dataMaterial}
        fieldLabel={'Material number'}
        fieldName={`item[${dataIndex}].material_number`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Material number'}
        classNames='mt-2'
      />
      <FormAutocomplete<any[]>
        options={dataUom}
        fieldLabel={'Purchase requisition unit of measure'}
        fieldName={`item[${dataIndex}].uom`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Purchase requisition unit of measure'}
        classNames='mt-2'
      />

      <FormInput
        fieldLabel={'Qty'}
        fieldName={`item[${dataIndex}].qty`}
        isRequired={false}
        disabled={false}
        type={'number'}
        placeholder={'Enter your qty'}
      />

      <FormAutocomplete<any[]>
        options={dataTax}
        fieldLabel={'Tax on sales'}
        fieldName={`item[${dataIndex}].tax`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Tax on sales'}
        classNames='mt-2'
      />
      <FormTextArea
        fieldLabel={'Short Text'}
        fieldName={`item[${dataIndex}].short_text`}
        isRequired={false}
        disabled={false}
        maxLength={40}
        classNames='mt-4'
        style={{
          width: '58.5rem',
        }}
      />
    </div>
  );
};
export default ArrayForm;
