import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { useForm } from 'react-hook-form';
import { CREATE_PR, DETAIL_PR } from '@/endpoint/purchaseRequisition/api';
import { LIST_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import { formModel } from './model/formModel';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import useDropdownOptionsArray from '@/lib/getDropdownArray';
import { modelDropdowns } from './model/modelDropdown';
import { usePage, Link } from '@inertiajs/react';
import { Auth } from '../Layouts/Header';
import axiosInstance from '@/axiosInstance';
import { Loading } from '@/components/commons/Loading';
import { FieldValues } from 'react-hook-form';

function Create({ id }: { id: number }) {
  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      item_material_group: 'NTSVC',
      item_uom: 'AU',
      item_tax: 'V0',
    } as FieldValues,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataModel, setDataModel] = useState(formModel);
  const { dropdownOptions, getDropdown } = useDropdownOptionsArray();
  const { auth } = usePage().props as unknown as { auth?: Auth };

  useEffect(() => {
    getDropdown(modelDropdowns, formModel);
  }, []);

  useEffect(() => {
    if (auth?.user?.is_admin !== '1') {
      const updatedObject = (dropdownOptions ?? []).map((field) =>
        field.name === 'user_id' ? { ...field, disabled: true } : field,
      );
      methods.setValue('user_id', auth?.user?.id);
      methods.setValue('item_material_group', 'NTSVC');
      methods.setValue('item_uom', 'AU');
      methods.setValue('item_tax', 'V0');
      setDataModel(updatedObject);
    } else {
      setDataModel(dropdownOptions as FormFieldModel<any>[]);
    }
  }, [dropdownOptions]);

  const getdetail = useCallback(async () => {
    if (id !== 0) {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_PR(id));
        const data = response.data;
        methods.reset(data.data.data);
        methods.setValue('status_id', 1);
        methods.setValue('item_material_group', 'NTSVC');
        methods.setValue('item_uom', 'AU');
        methods.setValue('item_tax', 'V0');
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [methods, id]);

  useEffect(() => {
    getdetail();
  }, [getdetail]);

  const doctType = methods.watch('document_type');

  useEffect(() => {
    if (doctType === 'ZENT') {
      methods.setValue('currency_from', 'IDR');
    }

    if (doctType !== 'ZENT') {
      methods.setValue('entertainment.tanggal', '');
      methods.setValue('entertainment.tempat', '');
      methods.setValue('entertainment.alamat', '');
      methods.setValue('entertainment.jenis', '');
      methods.setValue('entertainment.nama_perusahaan', '');
      methods.setValue('entertainment.nama', '');
      methods.setValue('entertainment.posisi', '');
      methods.setValue('entertainment.jenis_usaha', '');
      methods.setValue('entertainment.jenis_kegiatan', '');
    }
  }, [doctType]);

  return (
    <div className='card card-grid h-full min-w-full p-4'>
      <Loading isLoading={isLoading} />
      <div className='card-body'>
        <FormMapping
          formModel={dataModel}
          methods={methods}
          url={CREATE_PR}
          redirectUrl={LIST_PAGE_PR}
        />
      </div>
    </div>
  );
}

// Assign layout to the page
Create.layout = (page: ReactNode) => (
  <MainLayout title='Purchase Requisition' description='Purchase Requisition Clone'>
    {page}
  </MainLayout>
);

export default Create;
