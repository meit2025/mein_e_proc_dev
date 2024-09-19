import { Switch, FormControlLabel, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CSSProperties } from 'react';

interface FormSwitchProps {
  fieldLabel: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  requiredMessage?: string;
  classNames?: string;
  defaultChecked?: boolean;
}

const FormSwitch: React.FC<FormSwitchProps> = ({
  fieldLabel,
  fieldName,
  isRequired = false,
  disabled = false,
  style,
  requiredMessage,
  classNames,
  defaultChecked = false,
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
              <Switch
                {...field}
                checked={Boolean(field.value ?? defaultChecked)} // Handle the initial state
                onChange={(e) => field.onChange(e.target.checked)} // Update form state
                disabled={disabled}
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

export default FormSwitch;
