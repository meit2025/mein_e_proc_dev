import axiosInstance from '@/axiosInstance';
import { useState } from 'react';

interface StructDropdown {
  id: string | number;
  type: string;
  search?: string;
}

const useDataDropdown = () => {
  const [dataDropdown, setDataDropdown] = useState<any>({
    doc_id: '',
    dropdown_type: '',
    tabel_name: '',
    field_name: '',
    data_dropdown: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDropdown = async (struct: StructDropdown) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `api/master-pr/data-dropdown/detail/${struct.id}/${struct.type}`,
        {
          params: {
            search: struct.search || '', // Ensure search defaults to empty string
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

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

export default useDataDropdown;
