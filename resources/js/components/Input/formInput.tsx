import { FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CSSProperties, ReactNode } from 'react';

interface FormInputProps {
  fieldLabel: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  type?: string;
  requiredMessage?: string;
  placeholder?: string;
  minLength?: number; // Menambahkan minLength untuk validasi panjang minimal
  maxLength?: number; // Menambahkan maxLength untuk validasi panjang maksimal
  classNames?: string;
  icon?: ReactNode; // For passing an icon component or HTML
  iconPosition?: 'start' | 'end'; // Specify the position of the icon
}

const FormInput: React.FC<FormInputProps> = ({
  fieldLabel,
  fieldName,
  isRequired = false,
  disabled = false,
  style,
  type = 'text',
  requiredMessage,
  placeholder,
  minLength, // Parameter untuk panjang minimal
  maxLength, // Parameter untuk panjang maksimal
  classNames,
  icon,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='w-full mt-8'>
      <div className='flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
        <label className='form-label max-w-32'>
          {fieldLabel} <span className='text-red-700'> {isRequired ? '*' : ''}</span>
        </label>
        <Controller
          name={fieldName}
          control={control}
          rules={{
            required: isRequired ? (requiredMessage ?? `${fieldLabel} is required`) : false,
            ...(minLength !== undefined
              ? {
                  minLength: {
                    value: minLength,
                    message: `Minimum length is ${minLength} characters`,
                  },
                }
              : {}),
            ...(maxLength !== undefined
              ? {
                  maxLength: {
                    value: maxLength,
                    message: `Maximum length is ${maxLength} characters`,
                  },
                }
              : {}),
          }}
          render={({ field }) => {
            return (
              <>
                <label
                  className={`input ${isRequired && errors[fieldName] ? 'border-danger' : ''} ${classNames}`}
                  style={style}
                >
                  {icon}
                  <input
                    placeholder={placeholder}
                    type={type}
                    required={isRequired}
                    disabled={disabled}
                    {...field}
                    {...(minLength !== undefined ? { minLength: minLength } : {})}
                    {...(maxLength !== undefined ? { maxLength: maxLength } : {})}
                  />
                  <br />
                </label>
              </>
            );
          }}
        />
      </div>
      <div className='flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
        <label className='form-label max-w-32'>{''}</label>
        {errors[fieldName] && (
          <FormHelperText error>{String(errors[fieldName]?.message)}</FormHelperText>
        )}
      </div>
    </div>
  );
};

export default FormInput;
