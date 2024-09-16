import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

const FormInput = ({
  fieldLabel,
  fieldName,
  isRequired,
  disabled,
  style,
  type,
  requiredMessage,
  placeholder,
  minValue,
  maxValue,
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
          {...(minValue !== undefined ? { min: minValue } : {})}
          {...(maxValue !== undefined ? { max: maxValue } : {})}
          defaultValue={field.value}
          placeholder={placeholder}
          type={type}
          style={style}
          className={`${
            isRequired && !field.value ? 'wide-full required' : 'wide-full'
          } custom-placeholder`}
          disabled={disabled}
          helperText={errors[fieldName]?.message || ''}
        />
      )}
    />
  );
};

export default FormInput;
