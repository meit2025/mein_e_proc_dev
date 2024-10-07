import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'select',
    name: 'vendor',
    label: 'vendor',
    required: true,
    options: [],
  },
  {
    type: 'select',
    name: 'account_assignment_category',
    label: 'Account Assignment Category',
    required: true,
    options: [],
  },
];
