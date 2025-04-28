import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode, useState, useEffect } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import {columns} from './model/listModel';
import FormAutocomplete from '@/components/Input/formDropdown';
import { FormProvider, get, useForm } from 'react-hook-form';
import {
  REPORT_MY_REIMBURSE_LIST, REPORT_MY_REIMBURSE_EXPORT
} from '@/endpoint/report/api';
import useDropdownOptions from '@/lib/getDropdown';
import axiosInstance from '@/axiosInstance';
import { useAlert } from '@/contexts/AlertContext';

interface Props {}

export const Index = ({}: Props) => {
  const { dataDropdown: dataReimburseType, getDropdown: getReimburseType } = useDropdownOptions('api/master/reimburse-type/dropdown-list');
  const { dataDropdown: dataEmployee, getDropdown: getEmployee } = useDropdownOptions();
  const { dataDropdown: dataFamily, getDropdown: getFamily } = useDropdownOptions();
  const methods = useForm();
  // const [defaultSearch, setDefaultSearch] = useState<string>('?reimburse_type=null&employee=null&family=null&');
  const [reimburseType, setReimburseType] = useState<string | null>(null);
  const [employee, setEmployee] = useState<string | null>(null);
  const [family, setFamily] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useAlert();

  const roleAkses = 'report reimburse';
  const roleConfig = {
    detail: `${roleAkses} view`,
    create: `${roleAkses} create`,
    update: `${roleAkses} update`,
    delete: `${roleAkses} delete`,
  };

  useEffect(() => {
    getReimburseType('', {
      name: 'name',
      id: 'code',
      tabel: 'master_type_reimburses',
    });

    getEmployee('', {
      name: 'name',
      id: 'id',
      tabel: 'users',
    });

    const cardTitle = document.querySelector('h3.card-title') as HTMLHeadingElement;
    if (cardTitle) {
      cardTitle.style.display = 'none';
    }
  }, []);
  
  const exportExcel = async (data: string) => {
      try {
          setIsLoading(true);
          
          const response = await axiosInstance.get(REPORT_MY_REIMBURSE_EXPORT + data, {
              responseType: "blob"
          });

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'My_Reimburse_Report.xlsx');
          document.body.appendChild(link);
          link.click();

          showToast('Successfully exported file', 'success');
      } catch (error: any) {
          showToast(
              error.response?.data?.message || 'Failed to export file.',
              'error'
          );
      } finally {
          setIsLoading(false);
      }
    };

  return (
    <FormProvider {...methods}>
      <div className='flex flex-col md:mb-4 mb-2 w-full'>
        {/* Filters */}
        <div className='flex gap-4 mb-4'>
          <div>
            <label htmlFor='reimburse_type' className='block mb-1'>Reimburse Type</label>
            <FormAutocomplete<any>
              fieldName='reimburse_type'
              placeholder={'Select Reimburse Type'}
              classNames='mt-2 w-64'
              fieldLabel={''}
              options={dataReimburseType}
              onSearch={(search: string) => {
                const isLabelMatch = dataReimburseType?.some(option => option.label === search);
                if (search.length > 0 && !isLabelMatch) {
                    getReimburseType(search, {
                        name: 'name',
                        id: 'code',
                        tabel: 'master_type_reimburses',
                        search: search,
                    });
                } else if (search.length == 0 && !isLabelMatch) {
                    getReimburseType('', {
                        name: 'name',
                        id: 'code',
                        tabel: 'master_type_reimburses',
                    });
                }
            }}
            onChangeOutside={(data: any) => {
              setReimburseType(data);
            }}
            onFocus={() => {
                getReimburseType('', {
                    name: 'name',
                    id: 'code',
                    tabel: 'master_type_reimburses',
                })
            }}
            />
          </div>
          <div>
            <label htmlFor='employee' className='block mb-1'>Employee</label>
            <FormAutocomplete<any>
              fieldName='employee'
              placeholder={'Select Employee'}
              classNames='mt-2 w-64'
              fieldLabel={''}
              options={dataEmployee}
              onSearch={(search : any) => {
                const isLabelMatch = dataEmployee?.some(option => option.label === search);
                if (search.length > 0 && !isLabelMatch) {
                  getEmployee(search, {
                    name: 'name',
                    id: 'id',
                    tabel: 'users',
                    search: search,
                  });
                } else if (search.length == 0 && !isLabelMatch) {
                  getEmployee('', {
                    name: 'name',
                    id: 'id',
                    tabel: 'users',
                  });
                }
              }}
              onChangeOutside={(data: any) => {
                methods.setValue('family', null);
                if (data !== null) {
                  getFamily('', {
                    name: 'name',
                    id: 'id',
                    tabel: 'families',
                    where: {
                      key: 'userId',
                      parameter: data,
                    }
                  });
                } else {
                  getFamily('', {
                    name: 'name',
                    id: 'id',
                    tabel: 'families',
                    where: {
                      key: 'userId',
                      parameter: '0',
                    }
                  });
                }
                setEmployee(data);
              }}
              onFocus={() => {
                getEmployee('', {
                  name: 'name',
                  id: 'id',
                  tabel: 'users',
                })
              }}
            />
          </div>
          <div>
            <label htmlFor='family' className='block mb-1'>Family</label>
            <FormAutocomplete<any>
              fieldName='family'
              placeholder={'Select Family'}
              classNames='mt-2 w-64'
              fieldLabel={''}
              options={dataFamily}
              onSearch={(search : any) => {
                const isLabelMatch = dataFamily?.some(option => option.label === search);
                if (search.length > 0 && !isLabelMatch) {
                  getFamily(search, {
                    name: 'name',
                    id: 'id',
                    tabel: 'families',
                    where: {
                      key: 'userId',
                      parameter: methods.getValues('employee'),
                    },
                    search: search,
                  });
                } else if (search.length == 0 && !isLabelMatch) {
                  getFamily('', {
                    name: 'name',
                    id: 'id',
                    tabel: 'families',
                    where: {
                      key: 'userId',
                      parameter: methods.getValues('employee'),
                    }
                  });
                }
              }}
              onChangeOutside={(data: any) => {
                setFamily(data);
              }}
              onFocus={() => {
                getFamily('', {
                  name: 'name',
                  id: 'id',
                  tabel: 'families',
                  where: {
                    key: 'userId',
                    parameter: methods.getValues('employee'),
                  }
                })
              }}
            />
          </div>
          {/* <div>
            <button className='btn btn-success rounded-sm mt-8' onClick={handleFilter}>Filter</button>
          </div> */}
        </div>
      </div>
      <DataGridComponent
          role={roleConfig}
          onExportXls={async (x: string) => await exportExcel(x)}
          columns={columns}
          url={{
            url: REPORT_MY_REIMBURSE_LIST,
          }}
          labelFilter='search'
          defaultSearch={`?reimburse_type=${reimburseType}&employee=${employee}&family=${family}&`}
        />
    </FormProvider>
  );
};

// Assign layout to the page
Index.layout = (page: ReactNode) => (
  <MainLayout title='Report My Reimbursement' description='Report My Reimbursement'>
    {page}
  </MainLayout>
);

export default Index;
