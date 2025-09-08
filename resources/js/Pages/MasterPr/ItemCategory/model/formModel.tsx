import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'item_category',
    label: 'Item Category',
    placeholder: 'Enter your Item Category',
    required: true,
  },
  {
    type: 'input',
    name: 'text_category',
    label: 'Text Category',
    placeholder: 'Enter your Text Category',
    required: true,
  },
];
