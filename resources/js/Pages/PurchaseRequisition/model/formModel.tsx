import { FormFieldModel } from '@/interfaces/form/formWrapper';
import ItemForm from './itemForm';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'select',
    name: 'user_id',
    label: 'Requisition',
    required: true,
    options: [],
    style: {
      width: '63.3rem',
    },
  },
  {
    type: 'select',
    name: 'document_type',
    label: 'Document Type',
    required: true,
    options: [],
    style: {
      width: '63.3rem',
    },
  },
  {
    type: 'select',
    name: 'purchasing_groups',
    label: 'Purchasing Group',
    required: true,
    options: [],
    style: {
      width: '63.3rem',
    },
  },
  {
    type: 'select',
    name: 'account_assignment_categories',
    label: 'Account Assignment',
    required: true,
    options: [],
    style: {
      width: '63.3rem',
    },
  },

  {
    type: 'input',
    name: 'delivery_date',
    label: 'Delivery Date',
    required: true,
    texttype: 'date',
    placeholder: 'enter your date item delivery',
  },
  {
    type: 'select',
    name: 'storage_locations',
    label: 'Storage Location',
    required: false,
    options: [],
    style: {
      width: '63.3rem',
    },
  },
  {
    type: 'input',
    name: 'total_vendor',
    label: 'Total Vendor',
    required: true,
    texttype: 'number',
    placeholder: 'enter your Total Vendor',
  },
  {
    fieldCustome: true,
    fieldCustomeValue: <ItemForm />,
  },
];
