import axiosInstance from '@/axiosInstance';
import { useState } from 'react';
import { FormFieldModel } from '@/interfaces/form/formWrapper';

interface WhereProps {
  key?: string;
  parameter?: string;
  isNotNull?: boolean;
  groupBy?: string;
}

interface HasValueProps {
  key?: string;
  value?: any;
}

interface StructDropdown {
  isMapping?: boolean;
  name: string;
  id: string | number;
  tabel: string;
  where?: WhereProps;
  search?: string;
  attribut?: string;
  hasValue?: HasValueProps; // karena ada limit data ada kemungkinan value tidak terdapat di option (edit form), karena itu ditambah object key ini untu melakukan orwhere
  join?: string;
  hiddenZero?: boolean;
  idType?: 'number' | 'string';
  declaration?: string;
  softDelete?: boolean;
}

function removeLeadingZeros(input: string): string {
  if (/^0+\d+$/.test(input)) {
    return input.replace(/^0+/, '');
  }
  return input;
}

const useDropdownOptions = (urls: string = 'api/master/dropdown') => {
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
      const response = await axiosInstance.get(urls, {
        params: {
          name: struct.name,
          id: struct.id,
          search: struct.search || '',
          tabelname: struct.tabel,
          isNotNull: struct.where?.isNotNull ?? '',
          key: struct.where?.key ?? '',
          parameter: struct.where?.parameter ?? '',
          declaration: struct.declaration ?? '',
          groupBy: struct.where?.groupBy ?? '',
          attribut: struct.attribut ?? '',
          hasValueKey: struct.hasValue?.key ?? '',
          hasValue: struct.hasValue?.value ?? '',
          join: struct.join ?? '',
          softDelete: struct.softDelete ?? '',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const fetchedData = response.data.data.map((item: any) => {
        const label = struct.hiddenZero ? removeLeadingZeros(item.label) : item.label;
        const value = struct.hiddenZero ? removeLeadingZeros(item.value) : item.value;
        const idValue = struct.idType === 'string' ? String(value) : value;
        return {
          ...item,
          label: !struct.isMapping ? label : `${label} - ${value}`,
          value: idValue,
        };
      });
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
