import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import React, { ReactNode, useState } from 'react';

import { FormFieldModel } from '@/interfaces/form/formWrapper';
import FormWrapper from '@/components/form/FormWrapper';
import { Loading } from '../commons/Loading';
import axios from 'axios';
import axiosInstance from '@/axiosInstance';
import { useAlert } from '@/contexts/AlertContext';

interface FormMappingProps {
  formModel?: Array<FormFieldModel<any>>;
  url: string;
  redirectUrl?: string;
  methods: ReturnType<typeof useForm>;
  onSave?: (data: any) => Promise<void> | void;
  isLoading?: boolean;
  classForm?: string;
  isCustom?: boolean;
  formCustom?: ReactNode;
  formLogic?: ReactNode;
  disableButtonSubmit?: boolean;
}

const FormMapping: React.FC<FormMappingProps> = ({
  formModel,
  url,
  redirectUrl,
  methods,
  onSave,
  isLoading,
  classForm,
  isCustom = false,
  formCustom,
  formLogic,
  disableButtonSubmit = false,
}) => {
  const { setError, watch } = methods;
  const { showToast } = useAlert();
  const [isLoadings, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      showToast(response.data.message ?? 'success', 'success');
      onSave && (await onSave(response));
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000);
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
      }

      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        // Loop through the errors and set them in the form
        Object.keys(serverErrors).forEach((field) => {
          setError(field, {
            type: 'server',
            message: serverErrors[field].join(', '), // Join error messages if there are multiple for one field
          });
        });
      }
    }
    setIsLoading(false);
  };

  function isConditionMet(
    parameterValue: any, // Value being watched
    conditionalValue: any, // Value to compare against
    conditionType: string = '=', // Type of comparison, default to '='
  ): boolean {
    switch (conditionType) {
      case '=': // Equal
        return parameterValue === conditionalValue;
      case '>': // Greater than
        return parameterValue > conditionalValue;
      case '<': // Less than
        return parameterValue < conditionalValue;
      case '>=': // Greater than or equal
        return parameterValue >= conditionalValue;
      case '<=': // Less than or equal
        return parameterValue <= conditionalValue;
      case '!==': // Less than or equal
        return parameterValue !== conditionalValue;
      default: // Unknown condition type
        return parameterValue === conditionalValue;
    }
  }

  return (
    <FormProvider {...methods}>
      <Loading isLoading={isLoading || isLoadings} />
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className={classForm}>
          {isCustom ? (
            <>{formCustom}</>
          ) : (
            <>
              {(formModel ?? []).map((field, index) => (
                <div key={index} className={`mt-8 ${field.classPosition}`}>
                  {field.fieldCustome ? (
                    field.fieldCustomeValue
                  ) : (
                    <>
                      {!field.conditional ||
                      isConditionMet(
                        watch(field.parameterConditional ?? ''),
                        field.valueConditional,
                        field.conditionalType,
                      ) ? (
                        <FormWrapper model={field} />
                      ) : null}
                    </>
                  )}
                </div>
              ))}
            </>
          )}
          {formLogic}
        </div>
        {/* Kontainer untuk tombol di kanan bawah */}
        {!disableButtonSubmit && (
          <div className='flex justify-end mt-8'>
            <button
              type='submit'
              className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-all'
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default FormMapping;
