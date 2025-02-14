/* eslint-disable no-unused-vars */
import { Button, Input, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { ChangeEvent, useState, CSSProperties, ReactNode } from 'react';

interface FormFileUploadProps {
  fieldLabel: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  requiredMessage?: string;
  allowedExtensions?: string[];
  classNames?: string;
  onFileChangeOutside?: (file: string | null, fileName: string) => void;
  note?: ReactNode;
}

const FormFileUpload: React.FC<FormFileUploadProps> = ({
  fieldLabel,
  fieldName,
  isRequired = false,
  disabled = false,
  style,
  requiredMessage,
  allowedExtensions = [],
  classNames,
  onFileChangeOutside,
  note,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const {
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (
        allowedExtensions.length > 0 &&
        fileExtension &&
        !allowedExtensions.includes(fileExtension)
      ) {
        e.target.value = '';
        onChange(null);
        setFileName(null);
        setError(fieldName, {
          type: 'manual',
          message: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`,
        });
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      // Event handler untuk sukses membaca file
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (onFileChangeOutside) {
            onFileChangeOutside(reader.result, file.name);
          }
        } else {
          setError(fieldName, {
            type: 'manual',
            message: 'Failed to read file as Base64',
          });
        }
      };

      reader.onerror = () =>
        setError(fieldName, {
          type: 'manual',
          message: 'Failed to read file as Base64',
        });

      clearErrors(fieldName);
      setFileName(file.name);
      onChange(file);
    } else {
      onChange(null);
      setFileName(null);
      clearErrors(fieldName);
    }
  };

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={{
        required: isRequired ? (requiredMessage ?? `${fieldLabel} is required`) : false,
      }}
      render={({ field }) => (
        <>
          <div style={style} className={classNames}>
            <label className='block mb-2 text-sm font-medium text-gray-900 max-w-75'>
              {fieldLabel}
            </label>
            <Input
              type='file'
              className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none'
              disabled={disabled}
              onChange={(e) => handleFileChange(e as ChangeEvent<HTMLInputElement>, field.onChange)}
            />
          </div>
          <span style={{ marginLeft: '6rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            {allowedExtensions.length > 0 && <>Allowed types: {allowedExtensions.join(', ')}</>}
            <br></br>
            {note && note}
            {errors[fieldName] && (
              <FormHelperText error>{String(errors[fieldName]?.message)}</FormHelperText>
            )}
          </span>
        </>
      )}
    />
  );
};

export default FormFileUpload;
