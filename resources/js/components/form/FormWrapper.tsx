/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FormInput from '../Input/formInput';
import FormAutocomplete from '../Input/formDropdown';
import FormCheckbox from '../Input/formCheckbox';
import FormMultiSelect from '../Input/formMultiSelect';
import FormFileUpload from '../Input/formFieldUpload';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import FormTextArea from '../Input/formTextArea';
import FormSwitch from '../Input/formSwitch';

interface FormWrapperProps<T = any> {
  model: FormFieldModel<T>;
  onChangeOutside?: (value: T | T[] | any) => void;
}

const FormWrapper = <T,>({ model, onChangeOutside }: FormWrapperProps<T>) => {
  switch (model.type) {
    case 'input':
      return (
        <FormInput
          fieldLabel={model.label}
          fieldName={model.name}
          isRequired={model.required}
          disabled={model.disabled}
          style={model.style}
          type={model.texttype}
          requiredMessage={model.requiredMessage}
          placeholder={model.placeholder}
          minLength={model.minLength}
          maxLength={model.maxLength}
          classNames={model.classNames}
          icon={model.icon}
        />
      );
    case 'textarea':
      return (
        <FormTextArea
          fieldLabel={model.label}
          fieldName={model.name}
          isRequired={model.required}
          disabled={model.disabled}
          style={model.style}
          requiredMessage={model.requiredMessage}
          placeholder={model.placeholder}
          classNames={model.classNames}
        />
      );

    case 'select':
      return (
        <FormAutocomplete<T>
          options={model.options ?? []}
          fieldLabel={model.label}
          fieldName={model.name}
          isRequired={model.required}
          disabled={model.disabled}
          style={model.style}
          requiredMessage={model.requiredMessage}
          placeholder={model.placeholder}
          classNames={model.classNames}
          onChangeOutside={onChangeOutside}
        />
      );

    case 'checkbox':
      return (
        <FormCheckbox
          fieldLabel={model.label}
          fieldName={model.name}
          isRequired={model.required}
          disabled={model.disabled}
          style={model.style}
          requiredMessage={model.requiredMessage}
          classNames={model.classNames}
        />
      );

    case 'multiselect':
      return (
        <FormMultiSelect<T>
          options={model.options ?? []}
          fieldLabel={model.label}
          fieldName={model.name}
          isRequired={model.required}
          disabled={model.disabled}
          style={model.style}
          requiredMessage={model.requiredMessage}
          placeholder={model.placeholder}
          classNames={model.classNames}
          onChangeOutside={onChangeOutside}
        />
      );

    case 'switch':
      return (
        <FormSwitch
          fieldLabel={model.label}
          fieldName={model.name}
          isRequired={model.required}
          disabled={model.disabled}
          style={model.style}
          requiredMessage={model.requiredMessage}
          classNames={model.classNames}
        />
      );

    case 'file':
      return (
        <FormFileUpload
          fieldLabel={model.label}
          fieldName={model.name}
          allowedExtensions={model.allowedExtensions}
          disabled={model.disabled}
          onFileChangeOutside={onChangeOutside}
        />
      );

    default:
      return null;
  }
};

export default FormWrapper;
