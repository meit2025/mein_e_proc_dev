/* eslint-disable react/jsx-key */
import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/axiosInstance';
import { usePage } from '@inertiajs/react';
import { DETAIL_API } from '@/endpoint/getway/api';
import CustomTab from '@/components/commons/CustomTab';
import { contentsTabs, labelsTabs } from './model/detailModel';
import { Loading } from '@/components/commons/Loading';

const Detail = ({ id }: { id: number }) => {
  const { props } = usePage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<boolean>(false);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_API(props.id));
        const data = response.data;
        setData(data.data);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [props.id], // Include `methods` in the dependency array
  );

  useEffect(() => {
    getdetail();
  }, [getdetail]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <CustomTab tabLabels={labelsTabs} tabContents={contentsTabs(data)} />
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
