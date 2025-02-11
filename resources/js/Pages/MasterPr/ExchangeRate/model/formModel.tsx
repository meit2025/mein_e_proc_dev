import { FormFieldModel } from '@/interfaces/form/formWrapper';

export const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'worklist',
    label: 'Worklist',
    placeholder: 'Enter worklist',
    required: true,
  },
  {
    type: 'select',
    name: 'from',
    label: 'From',
    placeholder: 'Enter from',
    options: [],
    required: true,
    classNames: 'w-full',
  },
  {
    type: 'select',
    name: 'to',
    label: 'To',
    placeholder: 'Enter to',
    required: true,
    options: [],
    classNames: 'w-full',
  },
  {
    type: 'input',
    name: 'relation',
    label: 'Relation',
    placeholder: 'Enter relation',
    required: true,
  },
  {
    type: 'input',
    name: 'last_date',
    texttype: 'date',
    label: 'Date of Last Exrte',
    placeholder: 'Enter date of last exrte',
    required: true,
  },
  {
    type: 'input',
    name: 'old_er',
    label: 'Old Er',
    placeholder: 'Enter old er',
    required: false,
  },
  {
    type: 'input',
    texttype: 'number',
    name: 'tolerance',
    label: 'Tolarance',
    placeholder: 'Enter tolerance',
    required: false,
  }
];

export const modelDropdowns = [
  {
    dropdown: 'from',
    struct: {
      name: 'name',
      id: 'code',
      tabel: 'currencies',
      isMapping: true,
    },
  },
  {
    dropdown: 'to',
    struct: {
      name: 'name',
      id: 'code',
      tabel: 'currencies',
      isMapping: true,
    },
  },
];
