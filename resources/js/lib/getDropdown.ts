import axiosInstance from '@/axiosInstance';
import { useState } from 'react';
import { FormFieldModel } from '@/interfaces/form/formWrapper';

interface WhereProps {
  key?: string;
  parameter?: string;
  isNotNull?: boolean;
}
interface StructDropdown {
  name: string;
  id: string | number;
  tabel: string;
  where?: WhereProps;
}

const useDropdownOptions = () => {
  const [dropdownOptions, setDropdownOptions] = useState<FormFieldModel<any>[]>();
  const [dataDropdown, setdataDropdown] = useState<any[]>([]);

  const getDropdown = async (
    dropdown: string,
    struct: StructDropdown,
    object?: FormFieldModel<any>[],
  ) => {
    try {
      const response = await axiosInstance.get(
        `api/master/dropdown?name=${struct.name}&id=${struct.id}&tabelname=${struct.tabel}&isNotNull=${struct.where?.isNotNull ?? ''}&key=${struct.where?.key ?? ''}&parameter=${struct.where?.parameter ?? ''}`,
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
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  return { dataDropdown, dropdownOptions, getDropdown };
};

export default useDropdownOptions;
