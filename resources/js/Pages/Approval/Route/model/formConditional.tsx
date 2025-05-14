import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';
import FormInput from '@/components/Input/formInput';
import FormSwitch from '@/components/Input/formSwitchCustom';

export const FormConditional = () => {
  const { control, setValue, watch } = useFormContext();

  //   useEffect(() => {
  //     setValue('type_approval_conditional', 'nominal');
  //     setValue('day', 0);
  //     setValue('nominal', 0);
  //     setValue('is_restricted_area', false);
  //   }, [watch('is_bt'), watch('is_conditional'), watch('type_approval_conditional')]);

  return (
    <>
      {watch('is_conditional') && (
        <>
          {true === watch('is_bt') && (
            <FormAutocomplete<string>
              options={[
                {
                  label: 'Nominal Conditional',
                  value: 'nominal',
                },
                {
                  label: 'Day Conditional',
                  value: 'day',
                },
                {
                  label: 'Restricted Area Conditional',
                  value: 'restricted_area',
                },
              ]}
              fieldLabel={'Type Conditional'}
              fieldName={'type_approval_conditional'}
              isRequired={false}
              disabled={watch('is_bt') ? false : true}
              style={{
                width: '63.5rem',
              }}
            />
          )}

          {'day' === watch('type_approval_conditional') && (
            <FormInput
              fieldLabel={'Day Trip Conditional'}
              fieldName={'day'}
              isRequired={true}
              disabled={false}
              type={'number'}
              placeholder={'Enter Day Trip Conditional'}
            />
          )}
          {'nominal' === watch('type_approval_conditional') && (
            <FormInput
              fieldLabel={'Nominal Conditional'}
              fieldName={'nominal'}
              isRequired={true}
              disabled={false}
              type={'number'}
              placeholder={'Enter your Nominal Conditional'}
            />
          )}
          {'restricted_area' === watch('type_approval_conditional') && (
            <div className='mt-8'>
              <FormSwitch
                fieldLabel={'Restricted Area '}
                fieldName={'is_restricted_area'}
                isRequired={false}
                disabled={false}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FormConditional;
