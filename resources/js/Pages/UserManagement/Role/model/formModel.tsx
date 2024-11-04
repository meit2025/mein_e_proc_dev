import { FormFieldModel } from '@/interfaces/form/formWrapper';
import Permission from './permissionFrom';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your Name Permission',
    required: true,
  },
  {
    fieldCustome: true,
    fieldCustomeValue: <Permission />,
  },
];
