/* eslint-disable react/jsx-key */
import MainLayout from '@/Pages/Layouts/MainLayout';
import axiosInstance from '@/axiosInstance';
import CustomTab from '@/components/commons/CustomTab';
import { Loading } from '@/components/commons/Loading';
import { DETAIL_ROLE } from '@/endpoint/role/api';
import { useCallback, useEffect, useState } from 'react';
import { contentsTabs, labelsTabs } from './model/detailModel';

const Detail = ({ id }: { id: number }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();

  const getdetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(DETAIL_ROLE(id));
      const data = response.data;
      setData(data.data);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getdetail();
  }, [getdetail]);

  return (
    <MainLayout title={`Detail ${data?.name ?? ''}`} description={data?.purchasing_dsc}>
      <Loading isLoading={isLoading} />
      <CustomTab tabLabels={labelsTabs} tabContents={contentsTabs(data, id)} />
    </MainLayout>
  );
};

export default Detail;
