import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'key',
    label: 'Key',
    placeholder: 'Enter your key',
    minLength: 10,
    required: true,
  },
  {
    type: 'input',
    name: 'secret_key',
    label: 'Secret Key',
    placeholder: 'Enter your secret key',
    minLength: 10,
    required: true,
  },
  {
    type: 'input',
    name: 'employee',
    label: 'Employee',
    placeholder: 'Enter your employee',
    minLength: 10,
    required: true,
  },
  {
    type: 'textarea',
    name: 'desc',
    label: 'Description',
    placeholder: 'Enter your description',
    style: {
      width: '65.5rem',
    },
  },
  {
    type: 'switch',
    name: 'is_status',
    label: 'status',
    placeholder: 'Status',
    style: {
      width: '65.5rem',
    },
  },
];
