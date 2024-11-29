/* eslint-disable react/jsx-key */
import MainLayout from '@/Pages/Layouts/MainLayout';
import axiosInstance from '@/axiosInstance';
import CustomTabPr from '@/components/commons/CustomTabPr';
import { Loading } from '@/components/commons/Loading';
import { DETAIL_PR } from '@/endpoint/purchaseRequisition/api';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import PrDetail from './PrDetail';

const Detail = ({ id }: { id: number }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<boolean>(false);

  const getdetail = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(DETAIL_PR(id));
        const data = response.data;
        console.log(data.data.data);
        setData(data.data.data);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [id], // Include `methods` in the dependency array
  );

  useEffect(() => {
    getdetail();
  }, [getdetail]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <CustomTabPr detailLayout={<PrDetail id={id} />} id={id} type='VEN' logName='procurement' />
    </>
  );
};

// Assign layout to the page
Detail.layout = (page: ReactNode) => (
  <MainLayout title='Puchase Request Detail' description='Puchase Request Detail'>
    {page}
  </MainLayout>
);

export default Detail;
