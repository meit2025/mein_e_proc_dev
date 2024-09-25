/* eslint-disable react/jsx-key */
import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/axiosInstance';
import { usePage } from '@inertiajs/react';
import { DETAIL_API } from '@/endpoint/getway/api';
import CustomTab from '@/Components/commons/CustomTab';

const Detail = ({ id }: { id: number }) => {
  const { props } = usePage();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const labels = ['Detail', 'Value Parameter', 'Logs'];
  const contents = [
    <div>Overview content goes here</div>,
    <div>Details content goes here</div>,
    <div>Reviews content goes here</div>,
  ];

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_API(props.id));
        const data = response.data;
        methods.reset(data.data);
      } catch (error) {
        console.error('Error fetching detail:', error);
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
      <CustomTab tabLabels={labels} tabContents={contents} />
    </>
  );
};

// Assign layout to the page
Detail.layout = (page: ReactNode) => (
  <MainLayout title='Api' description='Api Detail'>
    {page}
  </MainLayout>
);

export default Detail;
