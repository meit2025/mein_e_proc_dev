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
  search?: string;
  where?: WhereProps;
  isMapping?: boolean;
  hiddenZero?: boolean;
}

interface DropdownProps {
  dropdown: string;
  struct: StructDropdown;
}

const useDropdownOptionsArray = () => {
  const [dropdownOptions, setDropdownOptions] = useState<FormFieldModel<any>[]>();

  const getDropdown = async (data: DropdownProps[], object?: FormFieldModel<any>[]) => {
    try {
      let dataObject = object;
      for (const item of data) {
        const response = await axiosInstance.get(
          `api/master/dropdown?name=${item.struct.name}&id=${item.struct.id}&tabelname=${item.struct.tabel}&search=${item.struct.search || ''}&isNotNull=${item.struct.where?.isNotNull ?? ''}&key=${item.struct.where?.key ?? ''}&parameter=${item.struct.where?.parameter ?? ''}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const fetchedData = response.data.data.map((items: any) => {
          const label = item.struct.hiddenZero ? removeLeadingZeros(items.label) : items.label;
          const value = item.struct.hiddenZero ? removeLeadingZeros(items.value) : items.value;
          return {
            ...items,
            label: !item.struct.isMapping ? label : `${label} - ${value}`,
            value: items.value,
          };
        });

        if (dataObject && item.dropdown !== '') {
          const updatedObject = dataObject.map((field) =>
            field.name === item.dropdown ? { ...field, options: fetchedData } : field,
          );
          dataObject = updatedObject;
        }
      }
      setDropdownOptions(dataObject);
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  return { dropdownOptions, getDropdown };
};

export default useDropdownOptionsArray;
function removeLeadingZeros(input: string): string {
  if (/^0+\d+$/.test(input)) {
    return input.replace(/^0+/, '');
  }
  return input;
}
