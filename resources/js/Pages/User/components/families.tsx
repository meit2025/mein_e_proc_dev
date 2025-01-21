import React, { ReactNode, useState } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columnsValue as originalColumnsValue } from '../model/listModel';
import { reimburseHistoryColumns } from '../model/listModel';
import {
  LIST_API_FAMILY,
  CREATE_API_FAMILY,
  EDIT_FAMILY,
  UPDATE_FAMILY,
  DESTROY_FAMILY,
  LIST_HISTORY_REIMBURSE_FAMILY
} from '@/endpoint/family/api';
import { Button } from '@/components/shacdn/button';
import FamilyHeaderForm from '@/Pages/Master/Family/components/form';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { FormType } from '@/lib/utils';

export const FamiliyLayout = ({ id }: { id: number }) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);
  const [openReimburseHistory, setOpenreimburseHistory] = React.useState<Array<any>>([]);

  const [formType, setFormType] = React.useState({
    type: FormType.create,
    id: undefined,
  });

  function openFormHandler() {
    setFormType({
      type: FormType.create,
      id: null,
    });
    setOpenForm(!openForm);
  }

  const openReimburseHistoryHandler = (item:any) => {
    setOpenreimburseHistory({id:item.id, familyName:item.name, familyStatus:item.status});
  }
  
  const columnsValue = [
    ...originalColumnsValue,
    {
      field: 'id',
      headerName: 'Reimburse History',
      width: 200,
      filterable: true,
      renderCell: (params:any) => 
        <Button
          onClick={() => openReimburseHistoryHandler({ id: params.id, name: params.row.name, status: params.row.status })}
          className='bg-slate-400 items-baseline'
          style={{ marginRight: '10px', marginBottom: '10px' }}
        >
          View History
        </Button>
    },
  ];

  return (
    <>
      <Button
        onClick={openFormHandler}
        className='bg-blue-500'
        style={{ marginRight: '10px', marginBottom: '10px' }}
      >
        <i className='ki-filled ki-people'></i>
        Add Family
      </Button>
      <CustomDialog
        onClose={() => setOpenForm(false)}
        open={openForm}
        onOpenChange={openFormHandler}
      >
        <FamilyHeaderForm
          type={formType.type}
          storeURL={CREATE_API_FAMILY}
          editURL={EDIT_FAMILY(formType.id ?? '')}
          updateURL={UPDATE_FAMILY(formType.id ?? '')}
          userId={id}
          onSuccess={(x: boolean) => setOpenForm(!x)}
        />
      </CustomDialog>
      <DataGridComponent
        columns={columnsValue}
        onEdit={(value) => {
          setFormType({
            type: FormType.edit,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        url={{
          url: LIST_API_FAMILY(id),
          deleteUrl: DESTROY_FAMILY,
        }}
        labelFilter='search'
      />

      {/* modal history reimburse */}
      <CustomDialog
        onClose={() => setOpenreimburseHistory([])}
        open={openReimburseHistory.length !== 0}
        className='md:max-w-[1200px]'
      >
        <h2>Reimburse History : {openReimburseHistory?.familyName} ( {openReimburseHistory?.familyStatus} )</h2>
        <DataGridComponent
          columns={reimburseHistoryColumns}
          url={{
            url: LIST_HISTORY_REIMBURSE_FAMILY(openReimburseHistory?.id),
          }}
          labelFilter='search'
        />
      </CustomDialog>
    </>
  );
};

export default FamiliyLayout;
