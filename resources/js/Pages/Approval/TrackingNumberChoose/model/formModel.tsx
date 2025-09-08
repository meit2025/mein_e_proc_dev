import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
  },
];
