import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    required: true,
  },
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
    texttype: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
  },

  {
    type: 'select',
    name: 'division_id',
    label: 'Division',
    placeholder: 'Select Division',
    options: [],
    required: true,
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'select',
    name: 'position_id',
    label: 'Position',
    placeholder: 'Select Position',
    options: [],
    required: true,
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'select',
    name: 'departement_id',
    label: 'Departement',
    placeholder: 'Select Departement',
    options: [],
    required: true,
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'select',
    name: 'master_business_partner_id',
    label: 'Business Partner',
    placeholder: 'Select Business Partner',
    options: [],
    required: true,
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'select',
    name: 'role_id',
    label: 'Role',
    placeholder: 'Select Role',
    options: [],
    required: true,
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'input',
    name: 'user_id_mein_attandace',
    label: 'User ID',
    placeholder: 'Enter your ID',
    required: true,
  },
  {
    type: 'input',
    name: 'sensor_id_mein_attadance',
    label: 'Sensor ID',
    placeholder: 'Enter your Sensor ID',
    required: true,
  },
  {
    type: 'input',
    name: 'sn_mein_attandance',
    label: 'SN',
    placeholder: 'Enter your SN',
    required: true,
  },
  {
    type: 'switch',
    name: 'is_admin',
    label: 'User Admin',
  },
  {
    type: 'switch',
    name: 'is_approval',
    label: 'User Approval',
  },
];
