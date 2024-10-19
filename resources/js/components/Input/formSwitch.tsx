import { Switch, FormControlLabel, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CSSProperties } from 'react';

interface FormSwitchProps {
  fieldLabel?: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  requiredMessage?: string;
  classNames?: string;
  defaultChecked?: boolean;
  note?: string;
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
  note,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='w-full'>
      <div className='flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
        {fieldLabel && (
          <label className='form-label max-w-32'>
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
            <div style={style} className={classNames}>
              <Switch
                {...field}
                checked={Boolean(field.value ?? defaultChecked)} // Handle the initial state
                onChange={(e) => field.onChange(e.target.checked)} // Update form state
                disabled={disabled}
              />
            </div>
          )}
        />
        <span>{note}</span>
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

export default FormSwitch;
