import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'material_group',
    label: 'material group',
    placeholder: 'Enter your material group',
    required: true,
  },
  {
    type: 'input',
    name: 'material_group_desc',
    label: 'description',
    placeholder: 'Enter your description',
    required: true,
  },
];
