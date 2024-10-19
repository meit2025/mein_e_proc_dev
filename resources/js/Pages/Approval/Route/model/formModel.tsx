import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'group_id',
    label: 'Group ID',
    placeholder: 'Enter your Group Id',
    required: true,
  },
  {
    type: 'switch',
    name: 'is_hr',
    label: 'Hr Approval',
    placeholder: 'Enter your description',
  },
  {
    conditional: true,
    valueConditional: true,
    parameterConditional: 'is_hr',
    type: 'select',
    name: 'hr_approval',
    label: 'Approval Position',
    placeholder: 'hr_approval',
    options: [
      {
        label: 'Start',
        value: 'start',
      },
      {
        label: 'End',
        value: 'end',
      },
    ],
    required: true,
    style: {
      width: '65.5rem',
    },
  },
  {
    type: 'switch',
    name: 'is_conditional',
    label: 'Approval Conditional',
    placeholder: 'Enter your Approval Conditional',
  },
  {
    conditional: true,
    valueConditional: true,
    parameterConditional: 'is_conditional',
    type: 'input',
    name: 'nominal',
    label: 'Nominal Conditional',
    placeholder: 'Enter your Nominal Conditional',
    required: true,
  },
];
