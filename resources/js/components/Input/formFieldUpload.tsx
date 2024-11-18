/* eslint-disable no-unused-vars */
import { Button, Input, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { ChangeEvent, useState, CSSProperties } from 'react';

interface FormFileUploadProps {
  fieldLabel: string;
  fieldName: string;
  isRequired?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  requiredMessage?: string;
  allowedExtensions?: string[];
  classNames?: string;
  onFileChangeOutside?: (file: File | null) => void;
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
        onChange(null);
        setFileName(null);
        setError(fieldName, {
          type: 'manual',
          message: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`,
        });
        return;
      }
      clearErrors(fieldName);
      setFileName(file.name);
      onChange(file);
      if (onFileChangeOutside) {
        onFileChangeOutside(file);
      }
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
        <div style={style} className={classNames}>
          <label>{fieldLabel}</label>
          <Input
            type='file'
            disabled={disabled}
            onChange={(e) => handleFileChange(e as ChangeEvent<HTMLInputElement>, field.onChange)}
          />
          {fileName && <p>Selected file: {fileName}</p>}
          {errors[fieldName] && (
            <FormHelperText error>{String(errors[fieldName]?.message)}</FormHelperText>
          )}
        </div>
      )}
    />
  );
};

export default FormFileUpload;
