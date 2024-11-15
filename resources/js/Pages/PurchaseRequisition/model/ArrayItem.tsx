import axiosInstance from '@/axiosInstance';
import { Loading } from '@/components/commons/Loading';
import FormAutocomplete from '@/components/Input/formDropdown';
import FormInput from '@/components/Input/formInput';
import FormTextArea from '@/components/Input/formTextArea';
import useDropdownOptions from '@/lib/getDropdown';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const ArrayItem = ({
  dataIndex,
  ItemIndex,
  subAsset,
  FetchDataValue,
}: {
  dataIndex: number;
  ItemIndex: number;
  subAsset: any[][][];
  FetchDataValue: (value: string, index: number, indexData: number) => void;
}) => {
  const { watch, setValue } = useFormContext();
  const { dataDropdown: costCenter, getDropdown: getCostCenter } = useDropdownOptions();
  const { dataDropdown: dataMaterial, getDropdown: getMaterialNumber } = useDropdownOptions();
  const { dataDropdown: dataMaterialGroup, getDropdown: getMaterialGroup } = useDropdownOptions();
  const { dataDropdown: dataTax, getDropdown: getTax } = useDropdownOptions();
  const { dataDropdown: dataUom, getDropdown: getUom } = useDropdownOptions();
  const { dataDropdown: dataIo, getDropdown: getIo } = useDropdownOptions();
  const { dataDropdown: dataMainAsset, getDropdown: getMainAssetNumber } = useDropdownOptions();
  const { dataDropdown: accountAssignment, getDropdown: getAccountAssignment } =
    useDropdownOptions();

  useEffect(() => {
    getCostCenter('', { name: 'desc', id: 'cost_center', tabel: 'master_cost_centers' });
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
    getIo('', {
      name: 'desc',
      id: 'order_number',
      tabel: 'master_orders',
    });
    getMainAssetNumber('', {
      name: 'desc',
      id: 'asset',
      tabel: 'master_assets',
      where: {
        groupBy: 'asset,desc',
      },
    });
    getAccountAssignment('', {
      name: 'description',
      id: 'account',
      tabel: 'account_assignment_categories',
    });
  }, []);

  return (
    <div>
      <FormAutocomplete<any>
        options={costCenter}
        fieldLabel={'Cost Center'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].cost_center`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Cost Center'}
        classNames='mt-2'
      />

      <FormAutocomplete<any>
        options={accountAssignment}
        fieldLabel={'Account Assignment'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].account_assignment_categories`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Account Assignment'}
        classNames='mt-2'
      />

      <FormAutocomplete<any>
        options={dataMaterialGroup}
        fieldLabel={'Material Group'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].material_group`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Material Group'}
        classNames='mt-2'
      />
      <FormAutocomplete<any>
        options={dataMaterial}
        fieldLabel={'Material number'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].material_number`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Material number'}
        classNames='mt-2'
      />
      <FormAutocomplete<any>
        options={dataUom}
        fieldLabel={'Uom'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].uom`}
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
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].qty`}
        isRequired={false}
        disabled={false}
        type={'number'}
        placeholder={'Enter your qty'}
        lengthLabel='28'
      />
      <FormInput
        fieldLabel={'Unit Price'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].unit_price`}
        isRequired={false}
        disabled={false}
        type={'number'}
        placeholder={'Unit Price'}
        lengthLabel='28'
        onChanges={(x: any) => {
          setValue(
            `vendors[${dataIndex}].units[${ItemIndex}].total_amount`,
            parseInt(watch(`vendors[${dataIndex}].units[${ItemIndex}].qty`)) *
              parseInt(x.target.value ?? '0'),
          );
        }}
      />
      <FormInput
        fieldLabel={'Total Amount'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].total_amount`}
        isRequired={false}
        disabled={true}
        type={'number'}
        lengthLabel='28'
        placeholder={'Enter your Total Amount'}
      />
      <FormAutocomplete<any>
        options={dataTax}
        fieldLabel={'Tax on sales'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].tax`}
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
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].short_text`}
        isRequired={false}
        disabled={false}
        maxLength={40}
        classNames='mt-4'
        style={{
          width: '58.5rem',
        }}
      />
      <FormAutocomplete<any>
        options={dataIo}
        fieldLabel={'Order Number'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].order_number`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Order Number'}
        classNames='mt-2'
      />
      <FormAutocomplete<any>
        options={dataMainAsset}
        fieldLabel={'Main Asset Number'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].asset_number`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Main Asset'}
        classNames='mt-2'
        onChangeOutside={(x: any) => FetchDataValue(x, ItemIndex, dataIndex)}
      />

      <FormAutocomplete<any>
        options={subAsset[dataIndex]?.[ItemIndex] ?? []}
        fieldLabel={'Sub Asset'}
        fieldName={`vendors[${dataIndex}].units[${ItemIndex}].sub_asset_number`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Sub Asset Number'}
        classNames='mt-2'
      />
    </div>
  );
};
export default ArrayItem;
