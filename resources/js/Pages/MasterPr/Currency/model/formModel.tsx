import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'code',
    label: 'Country Code',
    placeholder: 'Enter currency',
    required: true,
  },
  {
    type: 'input',
    name: 'name',
    label: 'Country',
    placeholder: 'Enter country',
    required: true,
  }
];
