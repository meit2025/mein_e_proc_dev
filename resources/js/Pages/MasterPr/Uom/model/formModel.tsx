import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'internal_uom',
    label: 'internal uom',
    placeholder: 'Enter your internal uom',
    required: true,
  },
  {
    type: 'input',
    name: 'iso_code',
    label: 'iso code',
    placeholder: 'Enter your iso code',
    required: true,
  },
  {
    type: 'input',
    name: 'commercial',
    label: 'commercial',
    placeholder: 'Enter your commercial',
    required: true,
  },
  {
    type: 'input',
    name: 'measurement_unit_text',
    label: 'measurement unit text',
    placeholder: 'Enter your measurement unit text',
    required: true,
  },
  {
    type: 'input',
    name: 'unit_of_measurement_text',
    label: 'unit of measurement text',
    placeholder: 'Enter your unit of measurement text',
    required: true,
  },
];
