import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'purchasing_doc',
    label: 'Document',
    placeholder: 'Enter your Document',
    required: true,
  },
  {
    type: 'input',
    name: 'purchasing_dsc',
    label: 'Description',
    placeholder: 'Enter your Description',
    required: true,
  },
];
