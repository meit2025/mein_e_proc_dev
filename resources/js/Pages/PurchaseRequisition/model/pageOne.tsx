import FormAutocomplete from '@/components/Input/formDropdown';
import FormInput from '@/components/Input/formInput';
import FormSwitch from '@/components/Input/formSwitch';
import FormTextArea from '@/components/Input/formTextArea';
import useDropdownOptions from '@/lib/getDropdown';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface ItemData {
  material_number: string;
}

interface VendorData {
  id: string;
}

export const PageOne = ({ item, vendor }: { item: any[]; vendor: any[] }) => {
  const { watch, setValue, getValues } = useFormContext();

  console.log(getValues);
  const [items, setItems] = useState<ItemData[]>(item);
  const [vendors, setVendors] = useState<VendorData[]>(item);

  const { dataDropdown: costCenter, getDropdown: getCostCenter } = useDropdownOptions();
  const { dataDropdown: dataVendor, getDropdown: getVendor } = useDropdownOptions();
  const { dataDropdown: dataMaterial, getDropdown: getMaterialNumber } = useDropdownOptions();

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        material_number: '',
      },
    ]);
  };

  const handleRemoveItem = (index: any) => {
    const newInputs = items.filter((_, i) => i !== index);
    setItems(newInputs);
  };

  const handleAddVendor = () => {
    setVendors([
      ...vendors,
      {
        id: '',
      },
    ]);
  };

  const handleRemoveVendor = (index: any) => {
    const newInputs = vendors.filter((_, i) => i !== index);
    setVendors(newInputs);
  };

  useEffect(() => {
    if (items.length === 0) {
      setItems(item);
    }
  }, [item]);

  useEffect(() => {
    if (vendors.length === 0) {
      setVendors(vendor);
    }
  }, [vendor]);

  useEffect(() => {
    getCostCenter('', { name: 'cost_center', id: 'id', tabel: 'master_cost_centers' });
    getVendor('', { name: 'name_one', id: 'id', tabel: 'master_business_partners' });
    getMaterialNumber('', {
      name: 'material_number',
      id: 'material_number',
      tabel: 'master_materials',
    });
  }, []);

  return (
    <>
      <div className='w-full mt-8 border rounded-md shadow-md p-3'>
        <div className='w-full border rounded-md shadow-md p-4'>
          <p>BUDGET CONTROL </p>
          <hr></hr>
          <FormAutocomplete<any[]>
            options={costCenter}
            fieldLabel={'Cost Center'}
            fieldName={'const_center'}
            isRequired={true}
            disabled={false}
            style={{
              width: '61.8rem',
            }}
            placeholder={'Select Cost Center'}
            classNames='mt-2'
          />
          <FormInput
            fieldLabel={'Budgeted/non'}
            fieldName={'cost_center_budgeted'}
            isRequired={false}
            disabled={false}
            type={'number'}
            placeholder={'Enter your Budgeted'}
          />
        </div>
        <div className='w-full border rounded-md shadow-md p-4 mt-4'>
          <p>TRANSACTION CONTROL </p>
          <hr></hr>
          <FormInput
            fieldLabel={'Budgeted/non'}
            fieldName={'transaction_budgeted'}
            isRequired={false}
            disabled={false}
            type={'number'}
            placeholder={'Enter your Budgeted'}
          />
        </div>
        <div className='w-full border rounded-md shadow-md p-4 mt-4'>
          <p>Vendor Selection </p>
          <hr></hr>

          <div className='w-full border rounded-md shadow-md p-4 mt-4'>
            <p>Item Selection </p>
            <hr></hr>
            {(items ?? []).map((_, index) => {
              return (
                <div key={index} className='p-4 mb-2'>
                  <span onClick={() => handleRemoveItem(index)} style={{ cursor: 'pointer' }}>
                    <i className='ki-duotone ki-trash-square text-danger text-2xl'></i>
                  </span>
                  <FormAutocomplete<any[]>
                    options={dataMaterial}
                    fieldLabel={'Select Item'}
                    fieldName={`item[${index}].material_number`}
                    isRequired={true}
                    disabled={false}
                    style={{
                      width: '57.8rem',
                    }}
                    placeholder={'Select Item'}
                    classNames='mt-2'
                  />
                  <FormInput
                    fieldLabel={'Qty'}
                    fieldName={`item[${index}].qty`}
                    isRequired={false}
                    disabled={false}
                    type={'number'}
                    placeholder={'Enter your qty'}
                  />
                  <hr className='mt-4'></hr>
                </div>
              );
            })}

            <button
              type='button'
              onClick={handleAddItem}
              className='mt-4 bg-blue-500 text-white p-2 m-4 rounded-md'
            >
              add Item
            </button>
          </div>

          <div className='w-full border rounded-md shadow-md p-4 mt-4'>
            <p>Vendor Selection </p>
            <hr></hr>
            {(vendors ?? []).map((_, index) => {
              return (
                <div key={index} className=' w-full border rounded-md shadow-md p-4 mb-2'>
                  <span onClick={() => handleRemoveVendor(index)} style={{ cursor: 'pointer' }}>
                    <i className='ki-duotone ki-trash-square text-danger text-2xl'></i>
                  </span>
                  <FormAutocomplete<any[]>
                    options={dataVendor}
                    fieldLabel={'Select Vendor'}
                    fieldName={`vendor[${index}].vendor`}
                    isRequired={true}
                    disabled={false}
                    style={{
                      width: '58rem',
                    }}
                    placeholder={'Select Vendor'}
                    classNames='mt-2'
                  />
                  <FormSwitch
                    note={'Vendor Winner'}
                    fieldName={`vendor[${index}].vendor_winner`}
                    isRequired={false}
                    disabled={false}
                  />
                  {(items ?? []).map((item, i) => {
                    return (
                      <div key={i}>
                        <p className='mt-2'>
                          Material Code:{' '}
                          {watch(`item[${i}].material_number`) === ''
                            ? 'Not Selected Material Number'
                            : watch(`item[${i}].material_number`)}
                        </p>
                        <p className='mt-2'>
                          Qty:{' '}
                          {watch(`item[${i}].qty`) === ''
                            ? 'Not Selected Material Number'
                            : watch(`item[${i}].qty`)}
                        </p>
                        <FormInput
                          fieldLabel={'Unit Price'}
                          fieldName={`vendor[${index}].unit[${i}].unit_price`}
                          isRequired={false}
                          disabled={false}
                          type={'number'}
                          placeholder={'Unit Price'}
                          onChanges={(x: any) => {
                            setValue(
                              `vendor[${index}].unit[${i}].total_amount`,
                              parseInt(watch(`item[${i}].qty`)) * parseInt(x.target.value ?? '0'),
                            );
                          }}
                        />
                        <FormInput
                          fieldLabel={'Total Amount'}
                          fieldName={`vendor[${index}].unit[${i}].total_amount`}
                          isRequired={false}
                          disabled={true}
                          type={'number'}
                          placeholder={'Enter your Total Amount'}
                        />
                        <FormInput
                          fieldLabel={'Other Criteria'}
                          fieldName={`vendor[${index}].unit[${i}].other_criteria`}
                          isRequired={false}
                          disabled={false}
                          type={'text'}
                          placeholder={'Enter your Other Criteria'}
                        />
                        <hr className='mt-4'></hr>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            <button
              type='button'
              onClick={handleAddVendor}
              className='mt-4 bg-blue-500 text-white p-2 m-4 rounded-md'
            >
              add Vendor
            </button>
          </div>
          <FormTextArea
            fieldLabel={'Remark'}
            fieldName={'vendor_remark'}
            isRequired={false}
            disabled={false}
            classNames='mt-4'
            style={{
              width: '62rem',
            }}
          />
        </div>

        <div className='w-full border rounded-md shadow-md p-4 mt-4'>
          <p>SELECTED VENDOR </p>
          <hr></hr>
          <FormSwitch
            note={'Vendor Is Selected based on the lowest price'}
            fieldName={'vendor_selected_competitive_lowest_price'}
            isRequired={false}
            disabled={false}
          />
          <FormSwitch
            note={
              'Vendor is selected not only based on competitive price, but also considering other criteria. Examples for selection include, but are not limited to: quality, availability, lead time, after sales service, etc.'
            }
            fieldName={'vendor_selected_competitive_price'}
            isRequired={false}
            disabled={false}
          />
          <FormSwitch
            note={
              'Vendor is selected when no other vendor is capable of providing the requested item/service.'
            }
            fieldName={'vendor_selected_competitive_capable'}
            isRequired={false}
            disabled={false}
          />
          <FormTextArea
            fieldLabel={'Remark'}
            fieldName={'selected_vendor_remark'}
            isRequired={false}
            disabled={false}
            classNames='mt-4'
            style={{
              width: '62rem',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PageOne;
