import FormAutocomplete from '@/components/Input/formDropdown';
import FormInput from '@/components/Input/formInput';
import useDropdownOptions from '@/lib/getDropdown';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { a11yProps, TabPanel } from './itemForm';
import { useFormContext, useWatch } from 'react-hook-form';
import ArrayItem from './ArrayItem';
import FormSwitch from '@/components/Input/formSwitch';
import FormTextArea from '@/components/Input/formTextArea';
import DataGridComponent from '@/components/commons/DataGrid';
import { DataGrid } from '@mui/x-data-grid';
import { columnsItem } from './listModel';
import { Link } from '@inertiajs/react';

const ArrayForm = ({
  dataIndex,
  subAsset,
  FetchDataValue,
  disable,
}: {
  dataIndex: number;
  subAsset: any[][];
  disable: boolean;
  FetchDataValue: (value: string, index: number) => void;
}) => {
  const { getValues, setValue, watch } = useFormContext();
  const { dataDropdown: dataVendor, getDropdown: getVendor } = useDropdownOptions();
  const { dataDropdown: costCenter, getDropdown: getCostCenter } = useDropdownOptions();
  const { dataDropdown: accountAssignment, getDropdown: getAccountAssignment } =
    useDropdownOptions();
  const { dataDropdown: dataMaterialGroup, getDropdown: getMaterialGroup } = useDropdownOptions();
  const { dataDropdown: dataMaterial, getDropdown: getMaterialNumber } = useDropdownOptions();
  const { dataDropdown: dataTax, getDropdown: getTax } = useDropdownOptions();
  const { dataDropdown: dataUom, getDropdown: getUom } = useDropdownOptions();
  const { dataDropdown: dataIo, getDropdown: getIo } = useDropdownOptions();
  const { dataDropdown: dataMainAsset, getDropdown: getMainAssetNumber } = useDropdownOptions();

  //   const [value, setValue] = useState(0);

  //   const handleChange = (event: any, newValue: number) => {
  //     setValue(newValue);
  //   };

  // Watch the 'total_vendor' value
  const watchData = useWatch({ name: 'total_item' });
  const dataArrayItem = watch(`vendors[${dataIndex}].units`);

  const watchAccountAssigment = useWatch({ name: 'item_account_assignment_categories' });

  const watchDocumentType = useWatch({ name: 'document_type' });
  const watchIsCashAdvance = useWatch({ name: 'item_is_cashAdvance' });

  const tabCount = watchData > 0 ? watchData : 1;

  useEffect(() => {
    getCostCenter('', { name: 'desc', id: 'cost_center', tabel: 'master_cost_centers' });
    getVendor('', { name: 'name_one', id: 'id', tabel: 'master_business_partners' });
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
  }, []);

  useEffect(() => {
    getAccountAssignment('', {
      name: 'description',
      id: 'account',
      tabel: 'account_assignment_categories',
      attribut: watchDocumentType,
    });
  }, [watchDocumentType]);

  const handelGetMaterialNumber = async (value: string) => {
    getMaterialNumber('', {
      name: 'material_number',
      id: 'material_number',
      tabel: 'master_materials',
      attribut: value,
      where: {
        key: 'material_group',
        parameter: value,
      },
    });
  };
  const handleClick = async () => {
    const dataobj = getValues();
    const id = dataobj.item_id ?? `random-generated-id-${Math.random().toString(36).substr(2, 9)}`;

    const newItem = {
      id: id,
      qty: dataobj.item_qty,
      unit_price: dataobj.item_unit_price,
      total_amount: dataobj.item_qty * dataobj.item_unit_price,
      account_assignment_categories: dataobj.item_account_assignment_categories,
      cost_center: dataobj.item_cost_center,
      material_group: dataobj.item_material_group,
      material_number: dataobj.item_material_number,
      uom: dataobj.item_uom,
      tax: dataobj.item_tax,
      short_text: dataobj.item_short_text,
      order_number: dataobj.item_order_number,
      asset_number: dataobj.item_asset_number,
      sub_asset_number: dataobj.item_sub_asset_number,
      is_cashAdvance: dataobj.item_is_cashAdvance,
      cash_advance_purchases: {
        dp: dataobj.item_dp,
        reference: dataobj.item_reference,
        document_header_text: dataobj.item_document_header_text,
        document_date: dataobj.item_document_date,
        due_on: dataobj.item_due_on,
        text: dataobj.item_text_cash_advance,
      },
    };

    const currentItems = getValues(`vendors[${dataIndex}].units`) || [];
    let updatedItems = [];
    if (dataobj.action === 'edit') {
      updatedItems = currentItems.map((item: any, index: any) =>
        item.id === dataobj.indexEdit ? newItem : item,
      );
    } else {
      updatedItems = [...currentItems, newItem];
    }

    const totalSum = updatedItems.reduce(
      (sum: number, item: any) => sum + parseInt(item.total_amount),
      0,
    );

    const highestAmount = updatedItems.reduce((max: number, item: any) => {
      return item.unit_price > max ? parseInt(item.unit_price) : max;
    }, 0);
    setValue('amount_max', highestAmount);

    // Simpan array baru ke React Hook Form state
    setValue(`vendors[${dataIndex}].units`, updatedItems);
    setValue('total_all_amount', totalSum);
    setValue('indexEdit', 0);
    setValue('item_id', null);
    resetindex();
  };

  const resetindex = () => {
    setValue('indexEdit', '');
    setValue('action', 'create');
    setValue('item_account_assignment_categories', '');
    setValue('item_asset_number', '');
    setValue('item_cost_center', '');
    setValue('item_document_date', '');
    setValue('item_document_header_text', '');
    setValue('item_dp', '');
    setValue('item_due_on', '');
    setValue('item_id', '');
    setValue('item_is_cashAdvance', '');
    setValue('item_material_group', '');
    setValue('item_material_number', '');
    setValue('item_order_number', '');
    setValue('item_qty', '');
    setValue('item_reference', '');
    setValue('item_short_text', '');
    setValue('item_sub_asset_number', '');
    setValue('item_tax', '');
    setValue('item_text_cash_advance', '');
    setValue('item_unit_price', '');
    setValue('item_uom', '');
    setValue('cash_advance_purchases', null);
  };

  const handelEdit = (data: any, rowIndex: any) => {
    console.log(rowIndex, data.id);

    const id = data.id ?? `random-generated-id-${Math.random().toString(36).substr(2, 9)}`;

    setValue('indexEdit', id);
    setValue('action', 'edit');

    setValue('item_account_assignment_categories', data.account_assignment_categories ?? '');
    setValue('item_asset_number', data.asset_number ?? '');
    setValue('item_cost_center', data.cost_center ?? '');

    setValue('item_id', id);
    setValue('item_is_cashAdvance', data.cash_advance_purchases?.reference !== null ? true : false);
    setValue('item_material_group', data.material_group ?? '');
    setValue('item_material_number', data.material_number ?? '');
    setValue('item_order_number', data.order_number ?? '');
    setValue('item_qty', data.qty ?? '0');
    setValue('item_short_text', data.short_text ?? '');
    setValue('item_sub_asset_number', data.sub_asset_number ?? '');
    setValue('item_tax', data.tax ?? '');
    setValue('item_unit_price', data.unit_price ?? '0');
    setValue('item_uom', data.uom ?? '');

    setValue('item_reference', data.cash_advance_purchases?.reference ?? '');
    setValue('item_dp', data.cash_advance_purchases?.dp ?? '');
    setValue('item_due_on', data.cash_advance_purchases?.due_on ?? '');
    setValue('item_text_cash_advance', data.cash_advance_purchases?.text ?? '');
    setValue('item_document_date', data.cash_advance_purchases?.document_date ?? '');
    setValue('item_document_header_text', data.cash_advance_purchases?.document_header_text ?? '');
  };

  const handleDelete = (data: any, rowIndex: any) => {
    const currentItems = getValues(`vendors[${dataIndex}].units`) || [];
    const updatedItems = currentItems.filter((item: any, index: number) => item.id !== data.id);
    setValue(`vendors[${dataIndex}].units`, updatedItems);
  };

  const action = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '10px', // Add consistent spacing between elements
          }}
        >
          <Link
            type='button'
            onClick={(event) => {
              event.preventDefault();
              handelEdit(params.row, params);
            }}
            href='#'
          >
            <i className=' ki-duotone ki-notepad-edit text-success text-2xl'></i>
          </Link>
          <Link
            type='button'
            onClick={(event) => {
              event.preventDefault();
              handleDelete(params.row, params);
            }}
            href='#'
          >
            <i className=' ki-duotone ki-trash-square text-danger text-2xl'></i>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <FormAutocomplete<any[]>
        options={dataVendor}
        fieldLabel={'Select Vendor'}
        fieldName={`vendors[${dataIndex}].vendor`}
        isRequired={true}
        style={{
          width: '56.5rem',
        }}
        placeholder={'Select Vendor'}
        classNames='mt-2'
        disabled={disable}
      />

      <FormSwitch
        fieldLabel='Vendor Winner'
        fieldName={`vendors[${dataIndex}].winner`}
        isRequired={false}
        disabled={disable}
      />
      {!disable && (
        <div className='card mt-2'>
          <div className='card-header'>
            <p>item</p>
          </div>
          <div
            className='card-body'
            style={{
              padding: '1rem',
            }}
          >
            <FormInput
              fieldLabel={'Qty'}
              fieldName={'item_qty'}
              isRequired={false}
              type={'number'}
              placeholder={'Enter your qty'}
              disabled={disable}
            />

            <FormInput
              fieldLabel={'Unit Price'}
              fieldName={'item_unit_price'}
              isRequired={false}
              disabled={disable}
              type={'number'}
              placeholder={'Unit Price'}
            />

            <FormAutocomplete<any>
              options={accountAssignment}
              fieldLabel={'Account Assignment'}
              fieldName={'item_account_assignment_categories'}
              isRequired={false}
              disabled={disable}
              style={{
                width: '56.5rem',
              }}
              placeholder={'Account Assignment'}
              classNames='mt-2'
            />
            {(watchAccountAssigment === 'K' ||
              watchAccountAssigment === 'V' ||
              watchAccountAssigment === 'W' ||
              watchAccountAssigment === 'Y') && (
              <FormAutocomplete<any>
                options={costCenter}
                fieldLabel={'Cost Center'}
                fieldName={'item_cost_center'}
                isRequired={false}
                disabled={disable}
                style={{
                  width: '56.5rem',
                }}
                placeholder={'Cost Center'}
                classNames='mt-2'
              />
            )}

            <FormAutocomplete<any>
              options={dataMaterialGroup}
              fieldLabel={'Material Group'}
              fieldName={'item_material_group'}
              isRequired={false}
              disabled={disable}
              style={{
                width: '56.5rem',
              }}
              placeholder={'Material Group'}
              classNames='mt-2'
              onChangeOutside={async (value: string, data: any) => {
                await handelGetMaterialNumber(value);
              }}
            />

            <FormAutocomplete<any>
              options={dataMaterial}
              fieldLabel={'Material number'}
              fieldName={'item_material_number'}
              isRequired={false}
              disabled={disable}
              style={{
                width: '56.5rem',
              }}
              placeholder={'Material number'}
              classNames='mt-2'
            />

            <FormAutocomplete<any>
              options={dataUom}
              fieldLabel={'Uom'}
              fieldName={'item_uom'}
              isRequired={false}
              disabled={disable}
              style={{
                width: '56.5rem',
              }}
              placeholder={'Purchase requisition unit of measure'}
              classNames='mt-2'
            />

            <FormAutocomplete<any>
              options={dataTax}
              fieldLabel={'Tax on sales'}
              fieldName={'item_tax'}
              isRequired={false}
              disabled={disable}
              style={{
                width: '56.5rem',
              }}
              placeholder={'Tax on sales'}
              classNames='mt-2'
            />
            <FormTextArea
              fieldLabel={'Short Text'}
              fieldName={'item_short_text'}
              isRequired={false}
              disabled={disable}
              maxLength={40}
              classNames='mt-4'
              style={{
                width: '56.5rem',
              }}
            />
            {watchAccountAssigment === 'F' && (
              <FormAutocomplete<any>
                options={dataIo}
                fieldLabel={'Order Number'}
                fieldName={'item_order_number'}
                isRequired={false}
                disabled={disable}
                style={{
                  width: '56.5rem',
                }}
                placeholder={'Order Number'}
                classNames='mt-2'
              />
            )}
            {watchAccountAssigment === 'A' && (
              <>
                <FormAutocomplete<any>
                  options={dataMainAsset}
                  fieldLabel={'Main Asset Number'}
                  fieldName={'item_asset_number'}
                  isRequired={false}
                  disabled={disable}
                  style={{
                    width: '56.5rem',
                  }}
                  placeholder={'Main Asset'}
                  classNames='mt-2'
                  onChangeOutside={(x: any, data: any) => {
                    FetchDataValue(x, dataIndex);
                  }}
                />

                <FormAutocomplete<any>
                  options={subAsset[dataIndex]}
                  fieldLabel={'Sub Asset'}
                  fieldName={'item_sub_asset_number'}
                  isRequired={false}
                  disabled={disable}
                  style={{
                    width: '56.5rem',
                  }}
                  placeholder={'Sub Asset Number'}
                  classNames='mt-2'
                />
              </>
            )}
            <FormSwitch
              fieldLabel='cash Advance'
              fieldName={'item_is_cashAdvance'}
              isRequired={false}
              disabled={disable}
            />
            {watchIsCashAdvance && (
              <>
                <hr></hr>
                <FormInput
                  fieldLabel={'Persantase DP Number'}
                  fieldName={'cash_advance_purchases.dp'}
                  isRequired={true}
                  disabled={disable}
                  type={'number'}
                  placeholder={'Persantase DP Number'}
                  maxLength={100}
                  minLength={1}
                />
                <FormInput
                  fieldLabel={'reference'}
                  fieldName={'item_reference'}
                  isRequired={false}
                  disabled={disable}
                  type={'text'}
                  placeholder={'Enter reference'}
                />
                <FormInput
                  fieldLabel={'Document Header Text'}
                  fieldName={'item_document_header_text'}
                  isRequired={false}
                  disabled={disable}
                  type={'text'}
                  placeholder={'Document Header Text'}
                />
                <FormInput
                  fieldLabel={'Document Date'}
                  fieldName={'item_document_date'}
                  isRequired={false}
                  disabled={disable}
                  type={'date'}
                  placeholder={'enter your Document Date'}
                />
                <FormInput
                  fieldLabel={'Due On'}
                  fieldName={'item_due_on'}
                  isRequired={false}
                  disabled={disable}
                  type={'date'}
                  placeholder={'enter your Due On'}
                />
                <FormInput
                  fieldLabel={'text'}
                  fieldName={'item_text_cash_advance'}
                  isRequired={false}
                  disabled={disable}
                  type={'text'}
                  placeholder={'enter your text'}
                />
              </>
            )}
          </div>
          <div className='card-footer'>
            <Button
              type='button'
              variant='contained'
              className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-all'
              onClick={async () => await handleClick()}
            >
              Add Item
            </Button>
          </div>
        </div>
      )}

      <Box sx={{ width: '100%', overflowX: 'auto', marginTop: '1rem' }}>
        <div className='lg:col-span-2'>
          <div className='grid'>
            <div className='card card-grid h-full min-w-full'>
              <div className='card-body'>
                <div data-datatable='true'>
                  <div className='scrollable-x-auto'>
                    <DataGrid
                      columns={[
                        ...(disable ? [] : action), // Spread an empty array if disabled, or the action array if not
                        ...columnsItem,
                      ]}
                      rows={dataArrayItem}
                      hideFooterPagination={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};
export default ArrayForm;
