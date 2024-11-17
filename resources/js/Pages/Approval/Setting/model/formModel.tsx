import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'titel',
    label: 'Title Setting',
    placeholder: 'Enter your Title Setting',
    required: true,
  },
  {
    type: 'input',
    name: 'key',
    label: 'Key  Setting',
    placeholder: 'Enter your Key  Setting',
    required: true,
  },
  {
    type: 'input',
    name: 'value',
    label: 'value  Setting',
    placeholder: 'Enter your value  Setting',
    required: true,
  },
  {
    type: 'switch',
    name: 'is_active',
    label: 'Active',
  },
];
