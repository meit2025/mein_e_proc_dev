import axiosInstance from '@/axiosInstance';
import { useState } from 'react';

interface StructDropdown {
  name: string;
  id: string | number;
  tabel: string;
}

const useDropdownOptions = () => {
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, any[]>>({});
  const [dataDropdown, setdataDropdown] = useState<any[]>([]);

  const getDropdown = async (dropdown: string, struct: StructDropdown) => {
    try {
      const response = await axiosInstance.get(
        `api/master/dropdown?name=${struct.name}&id=${struct.id}&tabelname=${struct.tabel}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (dropdown !== '') {
        setDropdownOptions((prevOptions) => ({
          ...prevOptions,
          [dropdown]: response.data.data,
        }));
      }
      setdataDropdown(response.data.data);
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  return { dataDropdown, dropdownOptions, getDropdown };
};

export default useDropdownOptions;
