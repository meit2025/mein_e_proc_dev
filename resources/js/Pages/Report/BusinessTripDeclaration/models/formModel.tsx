import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'select',
    name: 'request_no',
    label: 'Request No',
    required: true,
    options: [],
    style: {
      width: '63.3rem',
    },
  },
];
