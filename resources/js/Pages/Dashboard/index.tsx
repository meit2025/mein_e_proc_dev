import { ReactNode } from 'react';
import MainLayout from '../Layouts/MainLayout';
import FormInput from '@/Components/Input/formInput';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@mui/material';
import FormCheckbox from '@/Components/Input/formCheckbox';
import SearchIcon from '@mui/icons-material/Search';
import FormAutocomplete from '@/Components/Input/formDropdown';
import FormTextArea from '@/Components/Input/formTextArea';
import FormSwitch from '@/Components/Input/formSwitch';
import FormMultiSelect from '@/Components/Input/formMultiSelect';
import FormFileUpload from '@/Components/Input/formFieldUpload';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import FormMapping from '@/Components/form/FormMapping';

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
