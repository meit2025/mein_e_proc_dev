import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'nip',
    label: 'NIP',
    placeholder: 'Enter your nip',
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
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
  {
    type: 'input',
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
  },
  {
    type: 'input',
    name: 'job_level',
    label: 'Job Level',
    placeholder: 'Enter your job level',
    required: true,
  },
  {
    type: 'input',
    name: 'division',
    label: 'Division',
    placeholder: 'Enter your division',
    required: true,
  },
  {
    type: 'input',
    name: 'immediate_spv',
    label: 'Immediate SPV',
    placeholder: 'Enter your immediate spv',
    required: true,
  },
  {
    type: 'select',
    name: 'master_business_partner_id',
    label: 'Employee',
    placeholder: 'Select Employee',
    options: [],
    required: true,
    style: {
      width: '65.5rem',
    },
  },
  {
    type: 'switch',
    name: 'is_admin',
    label: 'User Admin',
  },
];
