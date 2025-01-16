import { Autocomplete, TextField, FormHelperText, Chip } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CSSProperties } from 'react';

interface Option<T> {
  label: string;
  value: T;
}

interface FormMultiSelectProps<T> {
  fieldLabel: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  requiredMessage?: string;
  options: Option<T>[]; // Array of options with typed values
  placeholder?: string;
  classNames?: string;
  onChangeOutside?: (value: T[]) => void; // External onChange handler
}

const FormMultiSelect = <T,>({
  fieldLabel,
  fieldName,
  isRequired = false,
  disabled = false,
  style,
  requiredMessage,
  options = [],
  placeholder,
  classNames,
  onChangeOutside,
}: FormMultiSelectProps<T>) => {
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
            multiple // Enable multiple selection
            options={options}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value}
            onChange={(_, data) => {
              field.onChange(data.map((item) => item.value)); // Update form state with selected values
              if (onChangeOutside) {
                onChangeOutside(data.map((item) => item.value)); // Trigger external onChange if provided
              }
            }}
            value={options.filter((option) => field.value?.includes(option.value))} // Sync form state
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
            renderTags={(selectedOptions, getTagProps) =>
              selectedOptions.map((option, index) => (
                <Chip label={option.label} {...getTagProps({ index })} key={index} />
              ))
            }
          />
          {errors[fieldName] && (
            <FormHelperText error>{String(errors[fieldName]?.message)}</FormHelperText>
          )}
        </div>
      )}
    />
  );
};

export default FormMultiSelect;
