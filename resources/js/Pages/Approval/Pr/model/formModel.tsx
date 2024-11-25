import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'select',
    name: 'document_type_id',
    label: 'Document Type',
    placeholder: 'document type',
    options: [],
    required: true,
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'input',
    name: 'dscription',
    label: 'Description',
    placeholder: 'Enter your description',
    required: true,
  },
  {
    type: 'switch',
    name: 'is_condition',
    label: 'Approval Condition',
    placeholder: '',
  },
  {
    conditional: true,
    valueConditional: true,
    parameterConditional: 'is_condition',
    type: 'select',
    name: 'condition_type',
    label: 'Condition Type',
    placeholder: 'conditon type',
    options: [
      {
        label: '>',
        value: '>',
      },
      {
        label: '<',
        value: '<',
      },
      {
        label: '>=',
        value: '>=',
      },
      {
        label: '<=',
        value: '<=',
      },
      {
        label: '=',
        value: '=',
      },
      {
        label: 'range',
        value: 'range',
      },
    ],
    required: true,
    style: {
      width: '63.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: 'range',
    conditionalType: '=',
    parameterConditional: 'condition_type',
    type: 'input',
    name: 'min_value',
    label: 'Min Value',
    placeholder: 'Enter your Min Value',
    required: true,
  },
  {
    conditional: true,
    valueConditional: 'range',
    conditionalType: '=',
    parameterConditional: 'condition_type',
    type: 'input',
    name: 'max_value',
    label: 'max Value',
    placeholder: 'Enter your max Value',
    required: true,
  },
  {
    conditional: true,
    valueConditional: 'range',
    conditionalType: '!==',
    parameterConditional: 'condition_type',
    type: 'input',
    name: 'value',
    label: 'Value',
    placeholder: 'Enter your Value',
  },
  {
    type: 'select',
    name: 'master_division_id',
    label: 'Division',
    placeholder: 'Division',
    options: [],
    required: true,
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'select',
    name: 'purchasing_group_id',
    label: 'Purchasing group',
    placeholder: 'Purchasing group',
    options: [],
    required: true,
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'select',
    name: 'master_tracking_number_id',
    label: 'Tracking number',
    placeholder: 'Tracking number',
    options: [],
    style: {
      width: '63.5rem',
    },
  },
];
