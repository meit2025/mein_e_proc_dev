import { FormFieldModel } from '@/interfaces/form/formWrapper';
import ItemForm from './itemForm';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'switch',
    name: 'is_cashAdvance',
    label: 'cash Advance',
    placeholder: 'cash Advance',
    style: {
      width: '65.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: true,
    parameterConditional: 'is_cashAdvance',
    type: 'input',
    name: 'cash_advance_purchases.reference',
    label: 'referance',
    placeholder: 'referance',
    style: {
      width: '63.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: true,
    parameterConditional: 'is_cashAdvance',
    type: 'input',
    name: 'cash_advance_purchases.document_header_text',
    label: 'Document Header Text',
    placeholder: 'Document Header Text',
    style: {
      width: '63.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: true,
    parameterConditional: 'is_cashAdvance',
    type: 'input',
    name: 'cash_advance_purchases.document_date',
    label: 'Delivery Date',
    required: true,
    texttype: 'date',
    placeholder: 'enter your Document Date',
  },
  {
    conditional: true,
    valueConditional: true,
    parameterConditional: 'is_cashAdvance',
    type: 'input',
    name: 'cash_advance_purchases.due_on',
    label: 'due on',
    required: true,
    texttype: 'date',
    placeholder: 'enter your Due On',
  },
  {
    conditional: true,
    valueConditional: true,
    parameterConditional: 'is_cashAdvance',
    type: 'input',
    name: 'cash_advance_purchases.text',
    label: 'text',
    placeholder: 'text',
    style: {
      width: '63.5rem',
    },
  },
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
    type: 'textarea',
    name: 'entertainment.header_not',
    label: 'Header Note',
    placeholder: 'Header Note',
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'input',
    name: 'entertainment.tanggal',
    texttype: 'date',
    label: 'tanggal entertainments',
    placeholder: 'tanggal entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'input',
    name: 'entertainment.tempat',
    label: 'tempat entertainments',
    placeholder: 'tempat entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'input',
    name: 'entertainment.alamat',
    label: 'alamat entertainments',
    placeholder: 'alamat entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'input',
    name: 'entertainment.jenis',
    label: 'jenis entertainments',
    placeholder: 'jenis entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'input',
    name: 'entertainment.nama',
    label: 'nama entertainments',
    placeholder: 'nama entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'input',
    name: 'entertainment.posisi',
    label: 'posisi entertainments',
    placeholder: 'posisi entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'input',
    name: 'entertainment.jenis_usaha',
    label: 'jenis usaha entertainments',
    placeholder: 'jenis usaha entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    type: 'input',
    name: 'entertainment.jenis_kegiatan',
    label: 'jenis kegiatan entertainments',
    placeholder: 'jenis kegiatan entertainments',
    style: {
      width: '63.5rem',
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
