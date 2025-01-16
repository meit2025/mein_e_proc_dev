import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CSSProperties, useEffect } from 'react';

interface FormCheckboxProps {
  fieldLabel: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  requiredMessage?: string;
  classNames?: string;
  onChange?: (checked: boolean) => void;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  fieldLabel,
  fieldName,
  isRequired = false,
  disabled = false,
  style,
  requiredMessage,
  classNames,
  onChange,
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
      }}
      render={({ field }) => (
        <div style={style} className={classNames}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                disabled={disabled}
                onChange={(e) => {
                  field.onChange(e.target.checked); // Update form state
                  if (onChange) {
                    onChange(e.target.checked); // Trigger optional onChange callback
                  }
                }}
              />
            }
            label={fieldLabel}
          />
          {errors[fieldName] && (
            <FormHelperText error>{String(errors[fieldName]?.message)}</FormHelperText>
          )}
        </div>
      )}
    />
  );
};

export default FormCheckbox;
