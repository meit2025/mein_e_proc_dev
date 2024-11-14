import axiosInstance from '@/axiosInstance';
import { useState } from 'react';
import { FormFieldModel } from '@/interfaces/form/formWrapper';

interface WhereProps {
  key?: string;
  parameter?: string;
  isNotNull?: boolean;
  groupBy?: string;
}
interface StructDropdown {
  name: string;
  id: string | number;
  tabel: string;
  where?: WhereProps;
  search?: string;
}

const useDropdownOptions = () => {
  const [dropdownOptions, setDropdownOptions] = useState<FormFieldModel<any>[]>();
  const [dataDropdown, setdataDropdown] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDropdown = async (
    dropdown: string,
    struct: StructDropdown,
    object?: FormFieldModel<any>[],
  ) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `api/master/dropdown?name=${struct.name}&id=${struct.id}&search=${struct.search ?? ''}&tabelname=${struct.tabel}&isNotNull=${struct.where?.isNotNull ?? ''}&key=${struct.where?.key ?? ''}&parameter=${struct.where?.parameter ?? ''}&groupBy=${struct.where?.groupBy ?? ''}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const fetchedData = response.data.data;
      if (object && dropdown !== '') {
        const updatedObject = object.map((field) =>
          field.name === dropdown ? { ...field, options: fetchedData } : field,
        );
        setDropdownOptions(updatedObject);
      }
      setdataDropdown(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  return { dataDropdown, dropdownOptions, getDropdown, isLoading };
};

export default useDropdownOptions;
