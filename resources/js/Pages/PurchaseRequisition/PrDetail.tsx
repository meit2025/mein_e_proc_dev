import { ReactNode, useCallback, useEffect, useState } from 'react';
import FormMapping from '@/components/form/FormMapping';
import useDropdownOptionsArray from '@/lib/getDropdownArray';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/axiosInstance';
import { usePage } from '@inertiajs/react';
import { DETAIL_PR, EDIT_PR } from '@/endpoint/purchaseRequisition/api';
import { LIST_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import { modelDropdowns } from './model/modelDropdown';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import { Loading } from '@/components/commons/Loading';
import { formModelEdit } from './model/formModelEdit';

const PrDetail = ({ id }: { id: number }) => {
  const { props } = usePage();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [dataModel, setDataModel] = useState(formModelEdit);
  const { dropdownOptions, getDropdown } = useDropdownOptionsArray();

  useEffect(() => {
    getDropdown(modelDropdowns, formModelEdit);
  }, []);

  useEffect(() => {
    setDataModel(dropdownOptions as FormFieldModel<any>[]);
  }, [dropdownOptions]);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_PR(props.id));
        const data = response.data;
        methods.reset(data);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [methods, props.id], // Include `methods` in the dependency array
  );

  useEffect(() => {
    getdetail();
  }, [getdetail]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            formModel={dataModel}
            methods={methods}
            url={`${EDIT_PR}/${props.id}`}
            redirectUrl={LIST_PAGE_PR}
          />
        </div>
      </div>
    </>
  );
};

export default PrDetail;
