import React, { ReactNode, useState } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import {columns} from '../model/listModel';
// import {
//   MY_REIMBURSE_LIST, FAMILY_BALANCE_REIMBURSE_LIST
// } from '@/endpoint/reimburse/page';
import {
  REPORT_MY_REIMBURSE_LIST,
} from '@/endpoint/report/api';
import { Button } from '@/components/shacdn/button';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { format } from 'date-fns';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';

export const ListLayout = ({ isEmployee }: { isEmployee: number }) => {
  const [openFamilyRelation, setOpenFamilyRelation] = React.useState<any>([]);
  const roleAkses = 'reimburse';
  const roleConfig = {
    detail: `${roleAkses} view`,
    create: `${roleAkses} create`,
    update: `${roleAkses} update`,
    delete: `${roleAkses} delete`,
  };

  const openFamilyRelationHandler = (item:any) => {
    setOpenFamilyRelation({id: item.id, name: item.name, family_status: item.family_status, maximumBalance: item.maximumBalance});
  }
  
  return (
    <>
      <DataGridComponent
        role={roleConfig}
        columns={columns}
        url={{
          url: REPORT_MY_REIMBURSE_LIST,
        }}
        labelFilter='search'
      />

      {/* modal balance family */}
      {/* <CustomDialog
        onClose={() => setOpenFamilyRelation([])}
        open={openFamilyRelation.length !== 0 && typeof openFamilyRelation === 'object'}
        className='md:max-w-[1200px]'
      >
        <h2>Reimburse Type : {openFamilyRelation?.name}</h2>
        <h2>Relation : {openFamilyRelation?.family_status}</h2>
        <h2>Maximum Balance : {formatRupiah(openFamilyRelation?.maximumBalance ?? 0)}</h2>
        {openFamilyRelation.length !== 0 && typeof openFamilyRelation === 'object' && (
          <DataGridComponent
            columns={familyBalanceColumns}
            url={{
              url: FAMILY_BALANCE_REIMBURSE_LIST(openFamilyRelation?.id, openFamilyRelation?.family_status?.toLowerCase(), openFamilyRelation?.maximumBalance),
            }}
            labelFilter='search'
          />
        )}
      </CustomDialog> */}
    </>
  );
};

export default ListLayout;
