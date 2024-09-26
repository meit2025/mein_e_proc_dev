import DataGridComponent from '@/components/commons/DataGrid';
import { columnsLogs } from '../model/listModel';
import { DELET_GATEWAY_VALUE, GET_GATEWAY_VALUE } from '@/endpoint/getwayValue/api';

export const LogsLayout = ({ id }: { id: number }) => {
  return (
    <>
      <DataGridComponent
        columns={columnsLogs}
        defaultSearch={`?function=setApiPost&id=${id}&`}
        url={{
          url: `${GET_GATEWAY_VALUE}`,
        }}
        labelFilter='search'
      />
    </>
  );
};

export default LogsLayout;
