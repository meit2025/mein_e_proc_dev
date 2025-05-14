import { FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CSSProperties, ReactNode } from 'react';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';

interface FormInputProps {
  fieldLabel: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  type?: string;
  requiredMessage?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  classNames?: string;
  lengthLabel?: string;
  icon?: ReactNode;
  onChanges?: (data: any) => void;
  isRupiah?: boolean;
  note?: string;
  removeDecimal?: boolean;
  nameDecimal?: string;
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
  minLength,
  maxLength,
  classNames,
  icon,
  onChanges,
  lengthLabel = 40,
  isRupiah = false,
  note,
  removeDecimal,
  nameDecimal = '',
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const currency = watch(nameDecimal);

  return (
    <div className='w-full mt-2'>
      <div className='flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
        <label className={`form-label max-w-${lengthLabel}`}>
          {fieldLabel} <span className='text-red-700'> {isRequired ? '*' : ''}</span>
        </label>
        <Controller
          name={fieldName}
          control={control}
          rules={{
            required: isRequired ? (requiredMessage ?? `${fieldLabel} is required`) : false,
            ...(minLength !== undefined
              ? {
                  minLength: {
                    value: minLength,
                    message: `Minimum length is ${minLength} characters`,
                  },
                }
              : {}),
            ...(maxLength !== undefined
              ? {
                  maxLength: {
                    value: maxLength,
                    message: `Maximum length is ${maxLength} characters`,
                  },
                }
              : {}),
          }}
          render={({ field }) => {
            const { onChange, ...restField } = field; // Extract onChange separately

            return (
              <label
                className={`input ${isRequired && errors[fieldName] ? 'border-danger' : ''} ${classNames}`}
                style={style}
              >
                {icon}
                <input
                  {...restField} // Spread the remaining properties excluding onChange
                  onChange={(e) => {
                    let value = e.target.value;

                    if (
                      type === 'number' &&
                      maxLength !== undefined &&
                      parseInt(value) > maxLength
                    ) {
                      return; // Prevent user from typing more than maxLength
                    }

                    if (removeDecimal && (currency === 'IDR' || currency === 'JPY')) {
                      value = value.replace(/[.,]/g, ''); // Hapus titik dan koma
                      e.target.value = value; // Set ulang nilai input agar tidak menghilang
                    }

                    onChange({
                      ...e,
                      target: { ...e.target, value },
                    });

                    if (onChanges) {
                      onChanges({
                        ...e,
                        target: { ...e.target, value },
                      });
                    }
                  }}
                  placeholder={placeholder}
                  type={type}
                  required={isRequired}
                  disabled={disabled}
                  minLength={minLength}
                  maxLength={maxLength}
                  onKeyDown={(e) => {
                    if (type === 'number' && e.key === '-') {
                      e.preventDefault(); // Cegah pengguna mengetik "-" lebih dari sekali
                    }

                    if (removeDecimal && (currency === 'IDR' || currency === 'JPY')) {
                      if (e.key === '.' || e.key === ',') e.preventDefault();
                    }
                  }}
                />
                {isRupiah && <span>{formatRupiah(watch(fieldName) ?? 0)}</span>}
              </label>
            );
          }}
        />
      </div>
      <div className='flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mt-2'>
        <label className={`form-label max-w-${lengthLabel}`}>{''}</label>
        {note && (
          <span
            style={{
              color: '#6B7280',
              fontSize: '0.75rem',
              lineHeight: '1.25rem',
            }}
          >
            {note}
          </span>
        )}
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

export default FormInput;
