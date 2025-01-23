import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';

export const CustomeForm = ({ data }: { data: any[] }) => {
  const { control, setValue, watch } = useFormContext();

  // 🔹 Gunakan useFieldArray agar React Hook Form tetap sinkron
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'user_approvals',
  });

  const { dataDropdown, getDropdown } = useDropdownOptions();

  useEffect(() => {
    getDropdown('', {
      name: 'username',
      id: 'id',
      tabel: 'users',
      where: {
        key: 'is_approval',
        parameter: 'true',
      },
    });
  }, []);

  // 🔹 Jika data belum diisi, set nilai default dari props
  useEffect(() => {
    if (fields.length === 0 && data.length > 0) {
      data.forEach((item) => append({ user_id: item.user_id }));
    }
  }, [data, fields]);

  return (
    <>
      <div className='w-full mt-8 border rounded-md shadow-md'>
        <div className='p-4'>User Approval</div>

        {fields.map((field, index) => (
          <div key={field.id} className='p-4 mb-2'>
            <div className='flex items-center gap-4'>
              <FormAutocomplete<any[]>
                options={dataDropdown ?? []}
                fieldLabel={`Approval L${index + 1}`}
                fieldName={`user_approvals.${index}.user_id`}
                isRequired={true}
                placeholder={'Select User Approval'}
                style={{
                  width: '64.5rem',
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
          onClick={() => append({ user_id: '' })}
          className='mt-4 bg-blue-500 text-white p-2 m-4 rounded-md'
        >
          Add Form
        </button>
      </div>
    </>
  );
};

export default CustomeForm;
