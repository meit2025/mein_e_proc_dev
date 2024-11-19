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
  minLength?: number;
  maxLength?: number;
  classNames?: string;
  lengthLabel?: string;
  icon?: ReactNode;
  onChanges?: (data: any) => void;
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
  minLength,
  maxLength,
  classNames,
  icon,
  onChanges,
  lengthLabel = 40,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='w-full mt-2'>
      <div className='flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
        <label className={`form-label max-w-${lengthLabel}`}>
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
            const { onChange, ...restField } = field; // Extract onChange separately

            return (
              <label
                className={`input ${isRequired && errors[fieldName] ? 'border-danger' : ''} ${classNames}`}
                style={style}
              >
                {icon}
                <input
                  {...restField} // Spread the remaining properties excluding onChange
                  onChange={(e) => {
                    onChange(e); // Call the default onChange handler from react-hook-form
                    if (onChanges) onChanges(e); // Also call custom onChanges if provided
                  }}
                  placeholder={placeholder}
                  type={type}
                  required={isRequired}
                  disabled={disabled}
                  minLength={minLength}
                  maxLength={maxLength}
                />
              </label>
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
