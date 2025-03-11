import FormAutocomplete from '@/components/Input/formDropdown';
import FormInput from '@/components/Input/formInput';
import useDropdownOptions from '@/lib/getDropdown';
import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import FormSwitch from '@/components/Input/formSwitch';
import FormTextArea from '@/components/Input/formTextArea';
import { DataGrid } from '@mui/x-data-grid';
import { columnsItem } from './listModel';
import { Link } from '@inertiajs/react';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
import axios from 'axios';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';

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
  const { showToast } = useAlert();

  // Watch the 'total_vendor' value
  const dataArrayItem = watch(`vendors[${dataIndex}].units`);

  const watchAccountAssigment = useWatch({ name: 'item_account_assignment_categories' });

  const watchDocumentType = useWatch({ name: 'document_type' });
  const item_material_group = useWatch({ name: 'item_material_group' });
  const currency_from = useWatch({ name: 'currency_from' });

  useEffect(() => {
    getCostCenter('', {
      name: 'desc',
      id: 'cost_center',
      tabel: 'master_cost_centers',
      hiddenZero: true,
      isMapping: true,
    });
    getVendor('', {
      name: 'name_one',
      id: 'id',
      tabel: 'master_business_partners',
      hiddenZero: true,
      isMapping: true,
    });
    getMaterialGroup('', {
      name: 'material_group_desc',
      id: 'material_group',
      tabel: 'material_groups',
      hiddenZero: true,
      isMapping: true,
    });
    getTax('', {
      name: 'description',
      id: 'mwszkz',
      tabel: 'pajaks',
      hiddenZero: true,
      isMapping: true,
    });
    getUom('', {
      name: 'unit_of_measurement_text',
      id: 'commercial',
      tabel: 'uoms',
      hiddenZero: true,
      isMapping: true,
    });
    getIo('', {
      name: 'desc',
      id: 'order_number',
      tabel: 'master_orders',
      hiddenZero: true,
      isMapping: true,
    });
    getMainAssetNumber('', {
      name: 'desc',
      id: 'asset',
      tabel: 'master_assets',
      where: {
        groupBy: 'asset,desc',
      },
      hiddenZero: true,
      isMapping: true,
    });
    handelGetMaterialNumber(item_material_group);
  }, []);

  useEffect(() => {
    getAccountAssignment('', {
      name: 'description',
      id: 'account',
      tabel: 'account_assignment_categories',
      attribut: watchDocumentType,
      hiddenZero: true,
      isMapping: true,
    });
  }, [watchDocumentType]);

  const handelGetMaterialNumber = async (value: string) => {
    getMaterialNumber('', {
      name: 'material_description',
      id: 'material_number',
      tabel: 'master_materials',
      attribut: value,
      isMapping: true,
      hiddenZero: true,
      where: {
        key: 'material_group',
        parameter: value,
      },
    });
  };
  const handleClick = async () => {
    try {
      const dataobj = getValues();
      const requiredFields = {
        item_qty: 'Qty',
        item_unit_price: 'Unit Price',
        item_account_assignment_categories: 'Account Assignment',
        item_material_group: 'Grup Material',
        item_material_number: 'Number Material',
        item_uom: 'UOM',
        item_tax: 'Tax',
        item_short_text: 'Short Text',
      };

      // Cek data yang kosong
      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !dataobj[key])
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        showToast(
          `Harap lengkapi data berikut sebelum menambahkan item:\n- ${missingFields.join('\n- ')}`,
          'error',
        );
        return;
      }

      const id =
        dataobj.item_id !== undefined && dataobj.item_id !== null && dataobj.item_id !== ''
          ? dataobj.item_id
          : `random-generated-id-${Math.random().toString(36).substr(2, 9)}`;

      // fetch currancy
      let currency_total = 0;
      if (dataobj.is_conversion_currency) {
        const response = await axiosInstance.post(
          '/currency-conversion',
          {
            from: dataobj.currency_from, // Mata uang asal
            to: dataobj.currency_to, // Mata uang tujuan
            amount: parseInt(dataobj.item_qty) * parseInt(dataobj.item_unit_price), // Jumlah yang dikonversi
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        currency_total = response.data.data;
      }

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
        total_amount_conversion: currency_total,
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

      // Simpan array baru ke React Hook Form state
      setValue(`vendors[${dataIndex}].units`, updatedItems);
      setValue('indexEdit', 0);
      setValue('item_id', null);

      const dataVendorArray = getValues('vendors').filter(
        (item: any) => (item.winner || false) === true,
      ); // get the vendor data

      const dataVendor = dataVendorArray.length > 0 ? dataVendorArray[0] : null;

      if (dataVendor !== null) {
        const winnerUnit = dataVendor.units || [];

        const totalSum = winnerUnit.reduce(
          (sum: number, item: any) => sum + parseInt(item.total_amount),
          0,
        );
        setValue('total_all_amount', totalSum);

        const highestAmount = winnerUnit.reduce((max: number, item: any) => {
          return item.unit_price > max ? parseInt(item.unit_price) : max;
        }, 0);
        setValue('amount_max', highestAmount);

        const data = (parseInt(watch('cash_advance_purchases.dp')) / 100) * parseInt(totalSum);
        setValue('cash_advance_purchases.nominal', data);
      }

      resetindex();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
      }
    }
  };

  const resetindex = () => {
    setValue('indexEdit', '');
    setValue('action', 'create');
    setValue('item_account_assignment_categories', '');
    setValue('item_asset_number', '');
    setValue('item_cost_center', '');
    setValue('item_id', '');
    setValue('item_is_cashAdvance', '');
    setValue('item_material_group', 'NTSVC');
    setValue('item_material_number', '');
    setValue('item_order_number', '');
    setValue('item_qty', '');
    setValue('item_short_text', '');
    setValue('item_sub_asset_number', '');
    setValue('item_tax', 'V0');
    setValue('item_unit_price', '');
    setValue('item_uom', 'AU');
    handelGetMaterialNumber('NTSVC');
  };

  const handelEdit = async (data: any, rowIndex: any) => {
    const id = data.id || `random-generated-id-${Math.random().toString(36).substr(2, 9)}`;
    await handelGetMaterialNumber(data.material_group);

    setValue('indexEdit', id);
    setValue('action', 'edit');

    setValue('item_account_assignment_categories', data.account_assignment_categories ?? '');
    setValue('item_asset_number', data.asset_number ?? '');
    setValue('item_cost_center', data.cost_center ?? '');

    setValue('item_id', id);
    setValue('item_material_group', data.material_group ?? '');
    setValue('item_material_number', data.material_number ?? '');
    setValue('item_order_number', data.order_number ?? '');
    setValue('item_qty', data.qty ?? '0');
    setValue('item_short_text', data.short_text ?? '');
    setValue('item_sub_asset_number', data.sub_asset_number ?? '');
    setValue('item_tax', data.tax ?? '');
    setValue('item_unit_price', data.unit_price ?? '0');
    setValue('item_uom', data.uom ?? '');
  };

  const handelCopy = async (data: any, rowIndex: any) => {
    const id = `random-generated-id-${Math.random().toString(36).substr(2, 9)}`;
    await handelGetMaterialNumber(data.material_group);
    setValue(': currency_total,', data.uom ?? '');

    const newItem = {
      id: id,
      qty: data.qty ?? '0',
      unit_price: data.unit_price ?? '0',
      total_amount: parseInt(data.qty) * parseInt(data.unit_price),
      account_assignment_categories: data.account_assignment_categories,
      cost_center: data.cost_center ?? '',
      material_group: data.material_group ?? '',
      material_number: data.material_number ?? '',
      uom: data.uom ?? '',
      tax: data.tax ?? '',
      short_text: data.short_text ?? '',
      order_number: data.order_number ?? '',
      asset_number: data.asset_number ?? '',
      sub_asset_number: data.sub_asset_number ?? '',
      total_amount_conversion: data.total_amount_conversion ?? '',
    };

    const currentItems = getValues(`vendors[${dataIndex}].units`) || [];

    const updatedItems = [...currentItems, newItem];
    setValue(`vendors[${dataIndex}].units`, updatedItems);

    const dataVendorArray = getValues('vendors').filter(
      (item: any) => (item.winner || false) === true,
    );

    const dataVendor = dataVendorArray.length > 0 ? dataVendorArray[0] : null;

    if (dataVendor !== null) {
      const winnerUnit = dataVendor.units || [];

      const totalSum = winnerUnit.reduce(
        (sum: number, item: any) => sum + parseInt(item.total_amount),
        0,
      );
      setValue('total_all_amount', totalSum);

      const highestAmount = winnerUnit.reduce((max: number, item: any) => {
        return item.unit_price > max ? parseInt(item.unit_price) : max;
      }, 0);
      setValue('amount_max', highestAmount);

      const data = (parseInt(watch('cash_advance_purchases.dp')) / 100) * parseInt(totalSum);
      setValue('cash_advance_purchases.nominal', data);
    }

    resetindex();
  };

  const handleDelete = (data: any, rowIndex: any) => {
    const currentItems = getValues(`vendors[${dataIndex}].units`) || [];
    const updatedItems = currentItems.filter((item: any, index: number) => item.id !== data.id);
    setValue(`vendors[${dataIndex}].units`, updatedItems);
  };

  const totalVendor = useWatch({ name: 'total_vendor' });

  // Determine tabCount, default to 1 if total_vendor is 0 or not set
  const tabCount = totalVendor > 0 ? totalVendor : 1;

  const dataCopyToVendor = (x: number) => {
    const currentItems = getValues(`vendors[${dataIndex}].units`) || [];

    setValue(`vendors[${x}].units`, currentItems);
  };
  useEffect(() => {
    const fetchCurrencyConversion = async () => {
      const dataobj = getValues();
      const currentItems = getValues(`vendors[${dataIndex}].units`) || [];

      if (!dataobj.is_conversion_currency) return; // Hanya eksekusi jika konversi diaktifkan

      const updatedItems = await Promise.all(
        currentItems.map(async (item: any) => {
          let cleanUnitPrice = item.unit_price;
          if (currency_from === 'IDR' || currency_from === 'JPY') {
            cleanUnitPrice = item.unit_price.toString().split(/[.,]/)[0];
          }
          try {
            const response = await axiosInstance.post(
              '/currency-conversion',
              {
                from: dataobj.currency_from,
                to: dataobj.currency_to,
                amount: parseInt(item.qty) * parseInt(item.unit_price), // Hitung jumlah konversi
              },
              {
                headers: { 'Content-Type': 'application/json' },
              },
            );

            return {
              ...item,
              total_amount_conversion: response.data.data,
              unit_price: cleanUnitPrice,
              total_amount: parseInt(cleanUnitPrice) * parseInt(item.qty),
            }; // Tambahkan hasil konversi ke item
          } catch (error) {
            return {
              ...item,
              total_amount_conversion: 0,
              unit_price: parseInt(cleanUnitPrice),
              total_amount: parseInt(cleanUnitPrice) * parseInt(item.qty),
            }; // Jika gagal, isi dengan 0
          }
        }),
      );

      setValue(`vendors[${dataIndex}].units`, updatedItems); // Simpan kembali hasil konversi
    };

    fetchCurrencyConversion();
  }, [currency_from]);

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
              handelCopy(params.row, params);
            }}
            href='#'
          >
            <i className='ki-filled ki-copy text-warning text-2xl'></i>
          </Link>
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

  const CustomFooter = () => {
    const totalAmount = (dataArrayItem ?? []).reduce(
      (sum: any, row: any) => parseInt(sum) + parseInt(row.total_amount),
      0,
    );
    const totalAmountConversion = (dataArrayItem ?? []).reduce(
      (sum: any, row: any) => parseInt(sum) + parseInt(row.total_amount_conversion),
      0,
    );

    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', background: '#f5f5f5' }}
      >
        <Typography sx={{ marginRight: '20px', fontWeight: 'bold' }}>
          Total Amount: {formatRupiah(totalAmount, false)}
        </Typography>
        <Typography sx={{ fontWeight: 'bold' }}>
          Total Amount Conversion: {formatRupiah(totalAmountConversion, false)}
        </Typography>
      </Box>
    );
  };

  return (
    <div>
      <FormAutocomplete<string>
        options={[
          {
            label: 'Existing',
            value: 'existing',
          },
          {
            label: 'New',
            value: 'new',
          },
        ]}
        fieldLabel={'Select Type Vendor'}
        fieldName={`vendors[${dataIndex}].type_vendor`}
        isRequired={true}
        style={{
          width: '56.5rem',
        }}
        placeholder={'Select Vendor'}
        classNames='mt-2'
        disabled={disable}
      />
      {watch(`vendors[${dataIndex}].type_vendor`) === 'existing' && (
        <>
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
            fieldLabel='Propose Vendor'
            fieldName={`vendors[${dataIndex}].winner`}
            isRequired={false}
            disabled={disable}
          />
        </>
      )}
      {watch(`vendors[${dataIndex}].winner`) && (
        <FormInput
          fieldLabel={'Number Quotation'}
          fieldName={`vendors[${dataIndex}].quotation`}
          isRequired={false}
          type={'text'}
          placeholder={'Number Quotation'}
          disabled={disable}
        />
      )}
      {watch(`vendors[${dataIndex}].type_vendor`) === 'new' && (
        <>
          <FormInput
            fieldLabel={'Vendor Name'}
            fieldName={`vendors[${dataIndex}].vendor_name_text`}
            isRequired={false}
            type={'text'}
            placeholder={'Enter your vendor'}
            disabled={disable}
          />
        </>
      )}
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
              removeDecimal={true}
              nameDecimal='currency_from'
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
              fieldLabel={'Material Number'}
              fieldName={'item_material_number'}
              isRequired={false}
              disabled={disable}
              style={{
                width: '56.5rem',
              }}
              placeholder={'Material Number'}
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
              fieldLabel={'Tax On Sales'}
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
                      slots={{
                        footer: CustomFooter,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
      {Array.from({ length: tabCount }, (_, index) => (
        <>
          {index !== dataIndex && (
            <Button
              key={index}
              type='button'
              variant='contained'
              style={{
                marginTop: '1rem',
                marginRight: '1rem',
              }}
              className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-all'
              onClick={async () => await dataCopyToVendor(index)}
            >
              Copy To Vendor {index + 1}
            </Button>
          )}
        </>
      ))}
    </div>
  );
};
export default ArrayForm;
