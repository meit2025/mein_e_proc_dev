import { useFormContext } from 'react-hook-form';
import FormInput from '@/components/Input/formInput';
import { useEffect, useState } from 'react';
import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';

interface ApprovalProps {
  master_tracking_number_id: string;
}

export const CustomeForm = ({ data }: { data: any[] }) => {
  const { getValues } = useFormContext();
  const [inputs, setInputs] = useState<ApprovalProps[]>(data);

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      {
        master_tracking_number_id: '',
      },
    ]);
  };

  const handleRemoveInput = (index: any) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const { dataDropdown, getDropdown } = useDropdownOptions();

  useEffect(() => {
    getDropdown('', {
      name: 'name',
      id: 'id',
      tabel: 'master_tracking_numbers',
    });
  }, []);

  useEffect(() => {
    if (inputs.length === 0) {
      setInputs(data);
    }
  }, [data]);

  return (
    <>
      <div className='w-full mt-8 border rounded-md shadow-md'>
        <div className='p-4'>Tracking Approval</div>
        {inputs.map((input, index) => (
          <div key={index} className='p-4 mb-2'>
            <div className='flex items-center gap-4'>
              {/* Use flexbox here */}
              <FormAutocomplete<any[]>
                options={dataDropdown ?? []}
                fieldLabel={`Tracking Number ${index + 1}`}
                fieldName={`approval_tracking_number_route[${index}].master_tracking_number_id`}
                isRequired={true}
                placeholder={'Select Tracking Number'}
                style={{
                  width: '60.5rem',
                }}
              />
              <span onClick={() => handleRemoveInput(index)} style={{ cursor: 'pointer' }}>
                <i className='ki-duotone ki-trash-square text-danger text-2xl'></i>
              </span>
            </div>
          </div>
        ))}
        <button
          type='button'
          onClick={handleAddInput}
          className='mt-4 bg-blue-500 text-white p-2 m-4 rounded-md'
        >
          add Form
        </button>
      </div>
    </>
  );
};

export default CustomeForm;
