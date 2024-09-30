import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CSSProperties } from 'react';

interface FormCheckboxProps {
  fieldLabel: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  requiredMessage?: string;
  classNames?: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  fieldLabel,
  fieldName,
  isRequired = false,
  disabled = false,
  style,
  requiredMessage,
  classNames,
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
            control={<Checkbox {...field} checked={!!field.value} disabled={disabled} />}
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
