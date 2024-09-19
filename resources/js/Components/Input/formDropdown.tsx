import { Autocomplete, TextField, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CSSProperties } from 'react';

// Define the option type as a generic T for flexibility
interface Option<T> {
  label: string;
  value: T;
}

interface FormAutocompleteProps<T> {
  fieldLabel: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  requiredMessage?: string;
  options: Option<T>[];
  placeholder?: string;
  classNames?: string;
  // eslint-disable-next-line no-unused-vars
  onChangeOutside?: (value: T) => void;
}

const FormAutocomplete = <T,>({
  fieldLabel,
  fieldName,
  isRequired = false,
  disabled = false,
  style,
  requiredMessage,
  options,
  placeholder,
  classNames,
  onChangeOutside,
}: FormAutocompleteProps<T>) => {
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
      }}
      render={({ field }) => (
        <div style={style} className={classNames}>
          <Autocomplete
            {...field}
            options={options}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value}
            onChange={(_, data) => {
              field.onChange(data ? data.value : null);
              if (onChangeOutside) {
                onChangeOutside(data ? data.value : null);
              }
            }}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                label={fieldLabel}
                placeholder={placeholder}
                error={Boolean(errors[fieldName])}
                required={isRequired}
              />
            )}
          />
          {errors[fieldName] && (
            <FormHelperText error>{String(errors[fieldName]?.message)}</FormHelperText>
          )}
        </div>
      )}
    />
  );
};

export default FormAutocomplete;
