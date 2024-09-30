import DataGridComponent from '@/components/commons/DataGrid';
import { columnsValue } from '../model/listModel';
import { DELET_GATEWAY_VALUE, GET_GATEWAY_VALUE } from '@/endpoint/getwayValue/api';
import { CREATE_PAGE_GATEWAY_VALUE, EDIT_PAGE_GATEWAY_VALUE } from '@/endpoint/getwayValue/page';

export const ValueLayout = ({ id }: { id: number }) => {
  return (
    <>
      <DataGridComponent
        columns={columnsValue}
        defaultSearch={`?gateway=${id}&`}
        url={{
          url: `${GET_GATEWAY_VALUE}`,
          addUrl: `${CREATE_PAGE_GATEWAY_VALUE}/${id}`,
          editUrl: EDIT_PAGE_GATEWAY_VALUE,
          deleteUrl: DELET_GATEWAY_VALUE,
        }}
        labelFilter='search'
      />
    </>
  );
};

export default ValueLayout;
