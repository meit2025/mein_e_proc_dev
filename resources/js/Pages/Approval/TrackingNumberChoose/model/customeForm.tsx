import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface ApprovalProps {
  master_tracking_number_id: string;
}

export const CustomeForm = ({ data }: { data: any[] }) => {
  const { getValues, setValue, watch } = useFormContext();
  const [inputs, setInputs] = useState<ApprovalProps[]>(data);

  const handleAddInput = () => {
    const inputs = getValues('approval_tracking_number_route');
    const newInputs = [...inputs, { master_tracking_number_id: '' }];
    setValue('approval_tracking_number_route', newInputs);
  };

  const handleRemoveInput = (index: any) => {
    console.log('index', index);
    const newInputs = watch('approval_tracking_number_route').filter(
      (_: any, i: number) => i !== index,
    );
    console.log('newInputs', newInputs);
    setInputs(newInputs);
    setValue('approval_tracking_number_route', newInputs);
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
        {(
          watch('approval_tracking_number_route') ?? [
            {
              master_tracking_number_id: '',
            },
          ]
        ).map((input: any, index: number) => (
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
