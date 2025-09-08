import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
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
