import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { Button } from '@/components/shacdn/button';

import { columns as originalColumns } from './models/models';
import { CustomDialog } from '@/components/commons/CustomDialog';
import {
  LIST_API_REIMBURSE_TYPE_USER_ASSIGN,
  UPDATE_USER_ASSIGN_REIMBURSE_TYPE_USER_ASSIGN,
  UPDATE_BATCH_USER_ASSIGN_REIMBURSE_TYPE_USER_ASSIGN
} from '@/endpoint/reimburseTypeUserAssign/api';
import { FormType } from '@/lib/utils';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
import { set } from 'date-fns';

const roleAkses = 'master reimburse type';
const roleConfig = {
  detail: `${roleAkses} view`,
  create: `${roleAkses} create`,
  update: `${roleAkses} update`,
  delete: `${roleAkses} delete`,
};

export const Index = ({reimburseType} : {reimburseType: any}) => {
  
  const { showToast } = useAlert();
  const [openModal, setOpenModal] = React.useState<string>('');
  const [checkedList, setCheckedList] = React.useState<any[]>([]);
  const [chekedAll, setChekedAll] = React.useState<boolean>(false);
  
  const columns = [
    {
      field: 'isAssign',
      headerName: 'Status Assignment',
      width: 150,
      filterable: false,
      sortable: false,
      renderCell: (params:any) => {
        let isChecked = checkedList?.[params.row.id]?.isAssign || params.row.isAssign;

        return (
          <input 
            type="checkbox"
            className='block mt-4 mx-auto'
            checked={isChecked || chekedAll}
            onChange={async () => {
              const checkbox = document.querySelector(`input[type="checkbox"][data-id="${params.row.id}"]`);
              if (checkbox) checkbox.disabled = true;
  
              try {
                const response = await axiosInstance.get(UPDATE_USER_ASSIGN_REIMBURSE_TYPE_USER_ASSIGN(checkedList?.[params.row.id]?.userAssignId || params.row.userAssignId || 0), {
                  params: {
                    userId          : params.row.id,
                    reimburseTypeId : reimburseType.id,
                    checkStatus     : isChecked
                  },
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });

                setChekedAll(false);
                setCheckedList((prev) => {
                  const newData = [...prev];
                  newData[params.row.id] = response.data.data;
                  return newData;
                });
                showToast(response.data.message, 'success');
              } catch (e: any) {
                const errorMessage = e.response?.data?.message || e.message;
                showToast(errorMessage, 'error');
              }
              setTimeout(() => {
                if (checkbox) checkbox.disabled = false;
              }, 3000);
            }}
            data-id={params.row.id}
          />
        )
      }
    },
    ...originalColumns
  ];


  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.get(UPDATE_BATCH_USER_ASSIGN_REIMBURSE_TYPE_USER_ASSIGN, {
        params: {
          reimburseTypeId : reimburseType.id,
          checkStatus     : openModal
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setCheckedList([]);
      setChekedAll(openModal == '1' ? true : false);
      showToast(response.data.message, 'success');
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message;
      showToast(errorMessage, 'error');
    }
    setOpenModal('');
  };

  return (
    <>
      <div className='relative p-4 overflow-y-hidden border rounded-lg border-gray-200 dark:border-gray-700'>
        <table className='w-full text-sm'>
          <tr>
            <td className='w-1/6'><strong>Reimburse Type</strong></td>
            <td className='w-5/6'>: <b>{reimburseType.code}</b> - {reimburseType.name}</td>
          </tr>
          <tr>
            <td className='w-1/6'><strong>Grade Option</strong></td>
            <td className='w-5/6'>: {reimburseType.grade_option}</td>
          </tr>
        </table>
        <br />

        <Button
          className='btn-xs bg-blue-600 hover:bg-blue-600'
          onClick={() => setOpenModal('1')}
          type='button'
        >
          Assign All User
        </Button>
        
        <Button
          className='btn-xs bg-red-600 hover:bg-red-600 md:ml-5'
          onClick={() => setOpenModal('0')}
          type='button'
        >
          Unassign All Users
        </Button>
      </div>

      <DataGridComponent
        role={roleConfig}
        columns={columns}
        url={{
          url: LIST_API_REIMBURSE_TYPE_USER_ASSIGN(reimburseType.id),
        }}
        labelFilter='search'
      />

      <CustomDialog
        onClose={() => setOpenModal('')}
        open={openModal !== ''}
        onSubmit={handleSubmit}
      >
        <p>Are you sure you want to {openModal === '1' ? 'assign' : 'unassign'} all users ?</p>
      </CustomDialog>
    </>
  );
};

Index.layout = (page: ReactNode) => (
  <MainLayout title='Reimburse Type User Assignment' description='Reimburse Type User Assignment'>
    {page}
  </MainLayout>
);

export default Index;
