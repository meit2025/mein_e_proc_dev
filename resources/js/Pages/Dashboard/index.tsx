import { ReactNode } from 'react';
import MainLayout from '../Layouts/MainLayout';
import FormInput from '@/components/Input/formInput';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@mui/material';
import FormCheckbox from '@/components/Input/formCheckbox';
import SearchIcon from '@mui/icons-material/Search';
import FormAutocomplete from '@/components/Input/formDropdown';
import FormTextArea from '@/components/Input/formTextArea';
import FormSwitch from '@/components/Input/formSwitch';
import FormMultiSelect from '@/components/Input/formMultiSelect';
import FormFileUpload from '@/components/Input/formFieldUpload';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import FormMapping from '@/components/form/FormMapping';

const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
    required: true,
  },
  {
    type: 'multiselect',
    name: 'hobbies',
    label: 'Select Hobbies',
    options: [
      { label: 'Reading', value: 'reading' },
      { label: 'Traveling', value: 'traveling' },
      { label: 'Cooking', value: 'cooking' },
    ],
    required: true,
    placeholder: 'Choose your hobbies',
  },
  {
    type: 'multiselect',
    name: 'favoriteNumbers',
    label: 'Select Favorite Numbers',
    options: [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
      { label: 'Three', value: 3 },
    ],
    required: true,
    placeholder: 'Choose your favorite numbers',
  },
];

function Index() {
  const url = 'https://api.example.com/submit';
  return (
    <b>
      <FormMapping formModel={formModel} url={url} />
    </b>
  );
}

// Assign layout to the page
Index.layout = (page: ReactNode) => <MainLayout>{page}</MainLayout>;

export default Index;
