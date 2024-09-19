import { TextField, InputAdornment } from '@mui/material';
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
  minValue?: number;
  maxValue?: number;
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
  minValue,
  maxValue,
  classNames,
  icon,
  iconPosition = 'end',
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: isRequired ? (requiredMessage ?? `${fieldLabel} is required`) : false,
        ...(minValue !== undefined
          ? { min: { value: minValue, message: `Minimum value is ${minValue}` } }
          : {}),
        ...(maxValue !== undefined
          ? { max: { value: maxValue, message: `Maximum value is ${maxValue}` } }
          : {}),
      }}
      render={({ field }) => (
        <TextField
          error={Boolean(errors[fieldName])}
          required={isRequired}
          label={fieldLabel}
          {...field}
          {...(minValue !== undefined ? { inputProps: { min: minValue } } : {})}
          {...(maxValue !== undefined ? { inputProps: { max: maxValue } } : {})}
          defaultValue={field.value}
          placeholder={placeholder}
          type={type}
          style={style}
          className={`${
            isRequired && !field.value ? 'wide-full required' : 'wide-full'
          } custom-placeholder ${classNames}`}
          disabled={disabled}
          helperText={errors[fieldName]?.message ? String(errors[fieldName]?.message) : ''}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            input: {
              ...(icon && {
                [`${iconPosition}Adornment`]: (
                  <InputAdornment position={iconPosition}>{icon}</InputAdornment>
                ),
              }),
            },
          }}
        />
      )}
    />
  );
};

export default FormInput;
