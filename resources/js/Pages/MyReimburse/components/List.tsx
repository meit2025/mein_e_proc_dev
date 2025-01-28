import React, { ReactNode, useState } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';
import {columns as originalColumns, familyBalanceColumns} from '../model/listModel';
import {
  MY_REIMBURSE_LIST, FAMILY_BALANCE_REIMBURSE_LIST
} from '@/endpoint/reimburse/page';
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
    setOpenFamilyRelation({id: item.id, reimburseType: item.reimburseType, relation: item.relation, maximumBalance: item.maximumBalance});
  }

  const columns = [
    ...originalColumns(isEmployee),
    ...(isEmployee == 0 ? [
      {
        field: 'id',
        headerName: 'Balance Family',
        width: 200,
        filterable: true,
        renderCell: (params:any) => 
          <Button
            onClick={() => openFamilyRelationHandler({ id: params.id, reimburseType: params.row.reimburseType, relation: params.row.relation, maximumBalance: params.row.maximumBalance })}
            className='bg-slate-400 items-baseline'
            style={{ marginRight: '10px', marginBottom: '10px' }}
          >
            Check Balance
          </Button>
      }
    ] : [])
  ];
  
  return (
    <>
      <DataGridComponent
        role={roleConfig}
        columns={columns}
        url={{
          url: MY_REIMBURSE_LIST(isEmployee),
        }}
        labelFilter='search'
      />

      {/* modal balance family */}
      <CustomDialog
        onClose={() => setOpenFamilyRelation([])}
        open={openFamilyRelation.length !== 0 && typeof openFamilyRelation === 'object'}
        className='md:max-w-[1200px]'
      >
        <h2>Reimburse Type : {openFamilyRelation?.reimburseType}</h2>
        <h2>Relation : {openFamilyRelation?.relation}</h2>
        <h2>Maximum Balance : {formatRupiah(openFamilyRelation?.maximumBalance ?? 0)}</h2>
        {openFamilyRelation.length !== 0 && typeof openFamilyRelation === 'object' && (
          <DataGridComponent
            columns={familyBalanceColumns}
            url={{
              url: FAMILY_BALANCE_REIMBURSE_LIST(openFamilyRelation?.id, openFamilyRelation?.relation?.toLowerCase(), openFamilyRelation?.maximumBalance),
            }}
            labelFilter='search'
          />
        )}
      </CustomDialog>
    </>
  );
};

export default ListLayout;
