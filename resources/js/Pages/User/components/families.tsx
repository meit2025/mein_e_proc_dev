import React, { ReactNode, useState } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import { columnsValue } from '../model/listModel';
import { LIST_API_FAMILY, CREATE_API_FAMILY ,EDIT_FAMILY, UPDATE_FAMILY ,DESTROY_FAMILY } from '@/endpoint/family/api';
import { Button } from '@/components/shacdn/button';
import FamilyHeaderForm from '@/Pages/Master/Family/components/form';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { FormType } from '@/lib/utils';

export const FamiliyLayout = ({ id }: { id: number }) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  const [formType, setFormType] = React.useState({
    type: FormType.create,
    id: undefined,
  });

  function openFormHandler() {
    setFormType({
      type: FormType.create,
      id: null,
    })
    setOpenForm(!openForm);
  }
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
        actionType='dropdown'
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
    </>
  );
};

export default FamiliyLayout;
