import { TextField, FormHelperText, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CSSProperties, useState } from 'react';

interface FormTextAreaProps {
  fieldLabel: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  requiredMessage?: string;
  placeholder?: string;
  rows?: number; // Minimum rows for textarea
  maxRows?: number; // Maximum rows for textarea
  maxLength?: number; // Maximum input length
  classNames?: string;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  fieldLabel,
  fieldName,
  isRequired = false,
  disabled = false,
  style,
  requiredMessage,
  placeholder,
  rows = 3,
  maxRows = 6,
  maxLength,
  classNames,
}) => {
  const [inputLength, setInputLength] = useState(0);
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLength(event.target.value.length);
  };

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: isRequired ? (requiredMessage ?? `${fieldLabel} is required`) : false,
      }}
      render={({ field }) => (
        <div style={style} className={classNames}>
          <TextField
            {...field}
            label={fieldLabel}
            multiline
            rows={rows}
            maxRows={maxRows}
            placeholder={placeholder}
            disabled={disabled}
            error={Boolean(errors[fieldName])}
            required={isRequired}
            variant='outlined'
            inputProps={{
              ...(maxLength ? { maxLength } : {}),
            }}
            onChange={(e) => {
              field.onChange(e); // Pass the value to react-hook-form
              handleInputChange(e as React.ChangeEvent<HTMLInputElement>); // Update the input length
            }}
          />
          {maxLength && (
            <Typography
              variant='caption'
              style={{ textAlign: 'right', display: 'block', marginTop: 4 }}
            >
              {inputLength}/{maxLength} characters
            </Typography>
          )}
          {errors[fieldName] && (
            <FormHelperText error>{String(errors[fieldName]?.message)}</FormHelperText>
          )}
        </div>
      )}
    />
  );
};

export default FormTextArea;
