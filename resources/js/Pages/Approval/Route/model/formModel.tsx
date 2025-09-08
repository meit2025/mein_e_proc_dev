import { FormFieldModel } from '@/interfaces/form/formWrapper';
import FormConditional from './formConditional';

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
    fieldCustome: true,
    fieldCustomeValue: <FormConditional />,
  },
];
