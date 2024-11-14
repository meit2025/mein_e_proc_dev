import { Autocomplete, TextField, FormHelperText, CircularProgress } from '@mui/material';
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
  lengthLabel?: string;
  // eslint-disable-next-line no-unused-vars
  onChangeOutside?: (value: T | null) => void;
  onSearch?: (query: string) => Promise<Option<T>[]>;
  loading?: boolean;
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
  lengthLabel = '40',
  onSearch,
  loading = false,
}: FormAutocompleteProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='w-full'>
      <div className='flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
        {fieldLabel && (
          <label className={`form-label max-w-${lengthLabel}`}>
            {fieldLabel} <span className='text-red-700'> {isRequired ? '*' : ''}</span>
          </label>
        )}
        <Controller
          name={fieldName}
          control={control}
          rules={{
            required: isRequired ? (requiredMessage ?? `${fieldLabel} is required`) : false,
          }}
          render={({ field }) => (
            <div className={`${classNames}`}>
              <Autocomplete
                {...field}
                value={options.find((option) => option.value === field.value) || null} // Make sure the value is controlled
                options={options}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value}
                onChange={(_, data) => {
                  field.onChange(data ? data.value : null);
                  if (onChangeOutside) {
                    onChangeOutside(data ? data.value : null);
                  }
                }}
                sx={{ ...style, pointerEvents: 'auto', cursor: 'auto' }}
                disabled={disabled}
                loading={loading}
                onInputChange={(_, newInputValue) => {
                  if (onSearch) {
                    onSearch(newInputValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={placeholder}
                    error={Boolean(errors[fieldName])}
                    required={isRequired}
                    style={{
                      pointerEvents: 'auto',
                    }}
                    InputProps={{
                      ...params.InputProps,
                      sx: { height: '36px' },
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </div>
          )}
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

export default FormAutocomplete;
