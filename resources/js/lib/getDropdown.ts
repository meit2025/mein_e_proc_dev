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
  isMapping?: boolean;
  name: string;
  id: string | number;
  tabel: string;
  where?: WhereProps;
  search?: string;
  attribut?: string;
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
      const response = await axiosInstance.get('api/master/dropdown', {
        params: {
          name: struct.name,
          id: struct.id,
          search: struct.search || '', // Ensure search defaults to empty string
          tabelname: struct.tabel,
          isNotNull: struct.where?.isNotNull ?? '', // Handle optional values
          key: struct.where?.key ?? '',
          parameter: struct.where?.parameter ?? '',
          groupBy: struct.where?.groupBy ?? '',
          attribut: struct.attribut ?? '',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const fetchedData = response.data.data.map((item: any) => ({
        label: !struct.isMapping ? item.label : `${item.label} - ${item.value}`,
        value: item.value,
      }));
      if (object && dropdown !== '') {
        const updatedObject = object.map((field) =>
          field.name === dropdown ? { ...field, options: fetchedData } : field,
        );
        setDropdownOptions(updatedObject);
      }
      setdataDropdown(fetchedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  return { dataDropdown, dropdownOptions, getDropdown, isLoading };
};

export default useDropdownOptions;
