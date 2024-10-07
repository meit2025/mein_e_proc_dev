import { useFormContext } from 'react-hook-form';
import FormInput from '@/components/Input/formInput';
import { useEffect, useState } from 'react';

interface StructDropdown {
  id: string;
  tabel: string;
  name: string;
}

export const CustomeForm = () => {
  const { watch, getValues } = useFormContext();
  const category = watch('account_assignment_category');
  const dataInitial = getValues();
  const [data, setData] = useState(dataInitial.EBKN ?? [{ id: 0 }]);

  const addData = () => {
    const newData = [...data, { id: data.length + 1 }];
    setData(newData);
  };

  return (
    <>
      <FormInput
        fieldLabel={'Short Text'}
        fieldName={'short_text'}
        isRequired={category === 'A' ? true : false}
        disabled={false}
        style={{}}
        type={'text'}
        placeholder={''}
        classNames={''}
      />

      <button
        className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-all'
        onClick={addData}
      >
        Add Button
      </button>
      {(data ?? []).map((Item: any, index: number) => {
        return (
          <div
            style={{
              marginTop: '2rem',
            }}
            key={index}
          >
            <FormInput
              fieldLabel={'Short Text'}
              fieldName={`EBKN[${index}].cost_center`}
              isRequired={category === 'A' ? true : false}
              disabled={false}
              style={{}}
              type={'text'}
              placeholder={''}
              classNames={''}
            />
          </div>
        );
      })}
    </>
  );
};

export default CustomeForm;
