import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'code',
    label: 'Currency',
    placeholder: 'Enter your currency',
    required: true,
  },
  {
    type: 'input',
    name: 'name',
    label: 'Country Code',
    placeholder: 'Enter your country code',
    required: true,
  }
];
