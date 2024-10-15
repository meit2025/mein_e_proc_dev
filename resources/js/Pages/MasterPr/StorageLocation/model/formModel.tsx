import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'plant',
    label: 'Name plant',
    placeholder: 'Enter your plant',
    required: true,
  },
  {
    type: 'input',
    name: 'storage_location',
    label: 'storage location',
    placeholder: 'Enter your storage location',
    required: true,
  },
  {
    type: 'input',
    name: 'storage_location_desc',
    label: 'storage location desc',
    placeholder: 'storage location desc',
    required: true,
  },
];
