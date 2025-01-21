import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export const CustomeForm = ({ data }: { data: any[] }) => {
  const { control, setValue, watch } = useFormContext();

  // 🔹 Gunakan useFieldArray untuk menangani daftar input dinamis
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'approval_tracking_number_route',
  });

  // 🔹 Dropdown Data
  const { dataDropdown, getDropdown } = useDropdownOptions();

  useEffect(() => {
    getDropdown('', {
      name: 'name',
      id: 'id',
      tabel: 'master_tracking_numbers',
    });
  }, []);

  // 🔹 Set Default Data Saat Pertama Kali Render
  useEffect(() => {
    if (fields.length === 0 && data.length > 0) {
      data.forEach((item) => append({ master_tracking_number_id: item.master_tracking_number_id }));
    }
  }, [data, fields]);

  return (
    <>
      <div className='w-full mt-8 border rounded-md shadow-md'>
        <div className='p-4'>Tracking Approval</div>

        {fields.map((field, index) => (
          <div key={field.id} className='p-4 mb-2'>
            <div className='flex items-center gap-4'>
              <FormAutocomplete<any[]>
                options={dataDropdown ?? []}
                fieldLabel={`Tracking Number ${index + 1}`}
                fieldName={`approval_tracking_number_route.${index}.master_tracking_number_id`}
                isRequired={true}
                placeholder={'Select Tracking Number'}
                style={{
                  width: '60.5rem',
                }}
              />
              <span onClick={() => remove(index)} style={{ cursor: 'pointer' }}>
                <i className='ki-duotone ki-trash-square text-danger text-2xl'></i>
              </span>
            </div>
          </div>
        ))}

        <button
          type='button'
          onClick={() => append({ master_tracking_number_id: '' })}
          className='mt-4 bg-blue-500 text-white p-2 m-4 rounded-md'
        >
          Add Form
        </button>
      </div>
    </>
  );
};

export default CustomeForm;
