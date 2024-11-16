/* eslint-disable react/jsx-key */
import { ReactNode, useCallback, useEffect, useState } from 'react';
import MainLayout from '@/Pages/Layouts/MainLayout';
import axiosInstance from '@/axiosInstance';
import { Loading } from '@/components/commons/Loading';
import CustomTabPr from '@/components/commons/CustomTabPr';
import BusinessTripDeclarationDetail from './components/BusinessTripDeclarationDetail';
import { GET_DETAIL_BUSINESS_TRIP_DECLARATION } from '@/endpoint/business-trip-declaration/api';
import { BusinessTripDeclaration } from './models/modelDetail';

const Detail = ({ id }: { id: number }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<BusinessTripDeclaration | null>(null);

  const getDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(GET_DETAIL_BUSINESS_TRIP_DECLARATION(id));
      const responseData = response.data;

      console.log('Response data:', responseData); // Log the entire response for debugging

      if (responseData && responseData.data) {
        setData(responseData.data); // Set data if available
      } else {
        console.warn('Data field is missing in the response.');
        setData(null); // Handle missing data
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
      setData(null); // Ensure data is null on error
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  return (
    <>
      <Loading isLoading={isLoading} />
      {data ? (
        <CustomTabPr
          detailLayout={<BusinessTripDeclarationDetail />}
          id={data.parent_id ? data.parent_id : id} // Check if parent_id exists
          type='BTRE'
        />
      ) : (
        <p>No details available for this business trip declaration.</p> // Handle null data case
      )}
    </>
  );
};

// Assign layout to the page
Detail.layout = (page: ReactNode) => (
  <MainLayout title='BusinessTrip Declaration Detail' description='BusinessTrip Declaration Detail'>
    {page}
  </MainLayout>
);

export default Detail;
