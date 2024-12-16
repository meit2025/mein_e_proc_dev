import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'name',
    label: 'Valuation Type Name',
    placeholder: 'Enter your Valuation Type Name',
    required: true,
  },
];
