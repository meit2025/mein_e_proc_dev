import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import FormMapping from '@/components/form/FormMapping';
import { CREATE_SECRET, DETAIL_SECRET, EDIT_SECRET } from '@/endpoint/secret/api';
import { LIST_PAGE_SECRET } from '@/endpoint/secret/page';
import { formModel } from './model/formModel';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/axiosInstance';
import { usePage } from '@inertiajs/react';
import PageOne from './model/pageOne';
import { DETAIL_PR, EDIT_PR } from '@/endpoint/purchaseRequisition/api';
import { LIST_PAGE_PR } from '@/endpoint/purchaseRequisition/page';

const Update = ({ id }: { id: number }) => {
  const { props } = usePage();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_PR(props.id));
        const data = response.data;
        methods.reset(data);
        setItems(data.item);
        setVendors(data.vendor);
      } catch (error) {
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
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            isLoading={isLoading}
            methods={methods}
            formCustom={<PageOne item={items} vendor={vendors} />}
            url={`${EDIT_PR}/${props.id}`}
            redirectUrl={LIST_PAGE_PR}
            isCustom={true}
          />
        </div>
      </div>
    </>
  );
};

// Assign layout to the page
Update.layout = (page: ReactNode) => (
  <MainLayout title='Gateway' description='Gateway Secret Update'>
    {page}
  </MainLayout>
);

export default Update;
