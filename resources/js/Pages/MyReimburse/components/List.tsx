import React, { ReactNode, useState } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import {columns} from '../model/listModel';
import {
  MY_REIMBURSE_LIST
} from '@/endpoint/reimburse/page';

export const ListLayout = ({ isEmployee }: { isEmployee: number }) => {
  const roleAkses = 'reimburse';
  const roleConfig = {
    detail: `${roleAkses} view`,
    create: `${roleAkses} create`,
    update: `${roleAkses} update`,
    delete: `${roleAkses} delete`,
  };

  return (
    <>
      <DataGridComponent
        role={roleConfig}
        columns={columns(isEmployee)}
        url={{
          url: MY_REIMBURSE_LIST(isEmployee),
        }}
        labelFilter='search'
      />
    </>
  );
};

export default ListLayout;
