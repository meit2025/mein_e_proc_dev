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
    ],
    required: true,
    style: {
      width: '65.5rem',
    },
  },

  {
    type: 'switch',
    name: 'is_bt',
    label: 'Approval Business Trip',
    placeholder: 'Enter your Approval Business Trip',
  },
  {
    type: 'switch',
    name: 'is_reim',
    label: 'Approval Reimbursement',
    placeholder: 'Enter your Approval Reimbursement',
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
  {
    conditional: true,
    valueConditional: true,
    parameterConditional: 'is_conditional',
    type: 'input',
    name: 'day',
    label: 'Day Trip Conditional',
    placeholder: 'Enter Day Trip Conditional',
    required: true,
  },
  {
    conditional: true,
    valueConditional: true,
    parameterConditional: 'is_conditional',
    type: 'switch',
    name: 'is_restricted_area',
    label: 'Restricted Area',
    placeholder: 'Enter your restricted area',
  },
];
