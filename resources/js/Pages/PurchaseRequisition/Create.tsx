import { ReactNode, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { FieldValues, useForm } from 'react-hook-form';
import { CREATE_PR } from '@/endpoint/purchaseRequisition/api';
import { LIST_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import { formModel } from './model/formModel';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import useDropdownOptionsArray from '@/lib/getDropdownArray';
import { modelDropdowns } from './model/modelDropdown';
import { usePage, Link } from '@inertiajs/react';
import { Auth } from '../Layouts/Header';

function Create() {
  const [dataModel, setDataModel] = useState(formModel);
  const { dropdownOptions, getDropdown } = useDropdownOptionsArray();
  const { auth } = usePage().props as unknown as { auth?: Auth };
  const methods = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      currency_from: 'IDR',
      is_conversion_currency: true,
      currency_to: 'IDR',
      total_vendor: 1,
      user_id: auth?.user?.id,
      item_material_group: 'NTSVC',
      item_uom: 'AU',
      item_tax: 'V0',
    } as FieldValues,
  });

  useEffect(() => {
    getDropdown(modelDropdowns, formModel);
  }, []);

  useEffect(() => {
    methods.setValue('total_vendor', 1);
    if (auth?.user?.is_admin !== '1') {
      const updatedObject = (dropdownOptions ?? []).map((field) =>
        field.name === 'user_id' ? { ...field, disabled: true } : field,
      );
      methods.setValue('user_id', auth?.user?.id);
      methods.setValue('currency_from', 'IDR');
      methods.setValue('item_material_group', 'NTSVC');
      methods.setValue('item_uom', 'AU');
      methods.setValue('item_tax', 'V0');
      setDataModel(updatedObject);
    } else {
      setDataModel(dropdownOptions as FormFieldModel<any>[]);
    }
  }, [dropdownOptions]);

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
  <MainLayout title='Purchase Requisition' description='Purchase Requisition Create'>
    {page}
  </MainLayout>
);

export default Create;
