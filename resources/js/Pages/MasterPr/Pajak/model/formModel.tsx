import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'mwszkz',
    label: 'Code Tax',
    placeholder: 'Enter your Code Tax',
    required: true,
  },
  {
    type: 'input',
    name: 'description',
    label: 'description',
    placeholder: 'Enter your description',
    required: true,
  },
  {
    type: 'input',
    name: 'desimal',
    label: 'desimal',
    placeholder: 'Enter your desimal',
    required: true,
  },
];
