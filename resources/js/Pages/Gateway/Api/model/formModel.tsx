import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'code_endpoint',
    label: 'code endpoint',
    placeholder: 'Enter your code endpoint',
    required: true,
  },
  {
    type: 'input',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
  },
  {
    type: 'input',
    name: 'tabel_name',
    label: 'Tabel name',
    placeholder: 'Enter your tabel_name',
    required: true,
  },
  {
    type: 'select',
    name: 'methods',
    label: 'methods',
    placeholder: 'Enter your methods',
    options: [
      {
        label: 'Post',
        value: 'post',
      },
      {
        label: 'Get',
        value: 'get',
      },
    ],
    required: true,
    style: {
      width: '65.5rem',
    },
  },
  {
    type: 'select',
    name: 'type',
    label: 'type',
    placeholder: 'Enter your Type',
    options: [
      {
        label: 'create',
        value: 'create',
      },
      {
        label: 'update',
        value: 'update',
      },
      {
        label: 'create Or Update',
        value: 'createOrUpdate',
      },
      {
        label: 'get',
        value: 'get',
      },
    ],
    required: true,
    style: {
      width: '65.5rem',
    },
  },
  {
    type: 'textarea',
    name: 'desc',
    label: 'Description',
    placeholder: 'Enter your Description',
    style: {
      width: '65.5rem',
    },
  },
  {
    type: 'textarea',
    name: 'command',
    label: 'Command',
    placeholder: 'Enter your command',
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

export const formModelValue: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'column_value',
    label: 'column',
    placeholder: 'Enter your column name',
    required: true,
  },
  {
    type: 'input',
    name: 'value',
    label: 'Parameter Value',
    placeholder: 'Enter your Parameter Value',
    required: true,
  },
  {
    type: 'input',
    name: 'default',
    label: 'Parameter default',
    placeholder: 'Enter your Parameter default',
    required: true,
  },
  {
    type: 'switch',
    name: 'is_key',
    label: 'key',
    placeholder: 'key',
    style: {
      width: '65.5rem',
    },
  },
];
