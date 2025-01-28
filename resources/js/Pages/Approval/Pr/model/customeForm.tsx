import { useFieldArray, useFormContext } from 'react-hook-form';
import FormInput from '@/components/Input/formInput';
import { useEffect, useState } from 'react';
import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';

interface ApprovalProps {
  user_id: string;
}

export const CustomeForm = ({ data }: { data: any[] }) => {
  const { getValues, setValue, control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'approval_route',
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

  useEffect(() => {
    if (fields.length === 0 && data.length > 0) {
      data.forEach((item) => append({ user_id: item.user_id }));
    }
  }, [data, fields]);

  return (
    <>
      <div className='w-full mt-8 border rounded-md shadow-md'>
        <div className='p-4'>User Approval</div>
        {fields.map((input, index) => (
          <div key={index} className='p-4 mb-2'>
            <div className='flex items-center gap-4'>
              <FormAutocomplete<any[]>
                options={dataDropdown ?? []}
                fieldLabel={`Approval ${index + 1}`}
                fieldName={`approval_route[${index}].user_id`}
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
          add Form
        </button>
      </div>
    </>
  );
};

export default CustomeForm;
