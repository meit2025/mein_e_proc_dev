import FormWrapper from '@/Components/form/FormWrapper';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';
import axios from 'axios';

interface FormMappingProps {
  formModel: Array<FormFieldModel<any>>;
  url: string;
}

const FormMapping: React.FC<FormMappingProps> = ({ formModel, url }) => {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Form successfully submitted:', response.data); // `response.data` contains the result
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error submitting form:', error.response?.data || error.message);
      } else {
        console.error('Unknown error submitting form:', error);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {formModel.map((field, index) => (
          <div
            key={index}
            style={{
              marginTop: '2rem',
            }}
          >
            <FormWrapper model={field} />
          </div>
        ))}
        <button type='submit'>Submit</button>
      </form>
    </FormProvider>
  );
};

export default FormMapping;
