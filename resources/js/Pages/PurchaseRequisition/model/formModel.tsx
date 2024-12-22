import { FormFieldModel } from '@/interfaces/form/formWrapper';
import ItemForm from './itemForm';
import CheckApproval from './checkApproval';
import CashAdvance from './CashAdvance';
import Attachment from './attachment';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'select',
    name: 'user_id',
    label: 'Requester',
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
    label: 'Recieving Location',
    required: false,
    options: [],
    style: {
      width: '63.3rem',
    },
  },

  {
    conditional: true,
    valueConditional: 'ZENT',
    parameterConditional: 'document_type',
    type: 'textarea',
    name: 'entertainment.header_not',
    label: 'Header Note',
    placeholder: 'Header Note',
    style: {
      width: '63.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: 'ZENT',
    parameterConditional: 'document_type',
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
    conditional: true,
    valueConditional: 'ZENT',
    parameterConditional: 'document_type',
    type: 'input',
    name: 'entertainment.tempat',
    label: 'tempat entertainments',
    placeholder: 'tempat entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: 'ZENT',
    parameterConditional: 'document_type',
    type: 'input',
    name: 'entertainment.alamat',
    label: 'alamat entertainments',
    placeholder: 'alamat entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: 'ZENT',
    parameterConditional: 'document_type',
    type: 'input',
    name: 'entertainment.jenis',
    label: 'jenis entertainments',
    placeholder: 'jenis entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: 'ZENT',
    parameterConditional: 'document_type',
    type: 'input',
    name: 'entertainment.nama_perusahaan',
    label: 'nama perusahaan',
    placeholder: 'nama perusahaan entertainments',
    style: {
      width: '63.5rem',
    },
  },

  {
    conditional: true,
    valueConditional: 'ZENT',
    parameterConditional: 'document_type',
    type: 'input',
    name: 'entertainment.nama',
    label: 'nama entertainments',
    placeholder: 'nama entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: 'ZENT',
    parameterConditional: 'document_type',
    type: 'input',
    name: 'entertainment.posisi',
    label: 'posisi entertainments',
    placeholder: 'posisi entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: 'ZENT',
    parameterConditional: 'document_type',
    type: 'input',
    name: 'entertainment.jenis_usaha',
    label: 'jenis usaha entertainments',
    placeholder: 'jenis usaha entertainments',
    style: {
      width: '63.5rem',
    },
  },
  {
    conditional: true,
    valueConditional: 'ZENT',
    parameterConditional: 'document_type',
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
    fieldCustomeValue: <Attachment isDisabled={false} />,
  },
  {
    fieldCustome: true,
    fieldCustomeValue: <ItemForm disable={false} />,
  },
  {
    fieldCustome: true,
    fieldCustomeValue: <CashAdvance disable={false} />,
  },
  {
    fieldCustome: true,
    fieldCustomeValue: <CheckApproval isDisabled={false} />,
  },
];
