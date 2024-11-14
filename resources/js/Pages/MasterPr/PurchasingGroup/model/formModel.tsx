import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'purchasing_group',
    label: 'purchasing group',
    placeholder: 'Enter your purchasing group',
    required: true,
  },
  {
    type: 'input',
    name: 'purchasing_group_desc',
    label: 'purchasing group description',
    placeholder: 'Enter your purchasing group description',
    required: true,
  },
];
