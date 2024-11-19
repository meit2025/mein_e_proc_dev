import axiosInstance from '@/axiosInstance';
import { useState } from 'react';

const useDataTabel = () => {
  const [dataDropdown, setDataDropdown] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDropdown = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('api/master/dropdown/tabel', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.data !== null) {
        setDataDropdown(response.data.data);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  return { dataDropdown, getDropdown, isLoading };
};

export default useDataTabel;
