import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'account',
    label: 'Name account',
    placeholder: 'Enter your account',
    required: true,
  },
  {
    type: 'input',
    name: 'description',
    label: 'description',
    placeholder: 'Enter your description',
    required: true,
  },
];
