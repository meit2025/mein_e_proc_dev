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

export const formDropdownTabel = [
  {
    value: 'document_types,purchasing_doc,id',
    label: 'document types',
  },
  {
    value: 'valuation_types,name,id',
    label: 'valuation types',
  },
  {
    value: 'purchasing_groups,purchasing_group,id',
    label: 'purchasing groups',
  },
  {
    value: 'purchasing_groups,purchasing_group,id',
    label: 'purchasing groups',
  },
  {
    value: 'account_assignment_categories,account,id',
    label: 'account assignment categories',
  },
  {
    value: 'item_categories,item_category,id',
    label: 'Item Category',
  },
  {
    value: 'storage_locations,storage_location,id',
    label: 'Storage Location',
  },
  {
    value: 'material_groups,material_group,id',
    label: 'Material Group',
  },
  {
    value: 'uoms,commercial,id',
    label: 'UOM',
  },
  {
    value: 'pajaks,mwszkz,id',
    label: 'Tax',
  },
];
