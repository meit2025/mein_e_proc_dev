/* eslint-disable react/jsx-key */
import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import axiosInstance from '@/axiosInstance';
import { DETAIL_USER } from '@/endpoint/user/api';
import CustomTab from '@/components/commons/CustomTab';
import { contentsTabs, labelsTabs } from './model/detailModel';
import { Loading } from '@/components/commons/Loading';
import { DETAIL_MASTER_DOKUMENT_TYPE } from '@/endpoint/dokumentType/api';

const Detail = ({ id }: { id: number }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();

  const getdetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(DETAIL_MASTER_DOKUMENT_TYPE(id));
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
    <MainLayout
      title={`Dokumen type ${data?.purchasing_doc ?? ''}`}
      description={data?.purchasing_dsc}
    >
      <Loading isLoading={isLoading} />
      <CustomTab tabLabels={labelsTabs} tabContents={contentsTabs(data, id)} />
    </MainLayout>
  );
};

export default Detail;
