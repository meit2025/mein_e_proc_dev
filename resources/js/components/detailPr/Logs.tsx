import DataGridComponent from '@/components/commons/DataGrid';
import { columnsLogs } from './model/listLog';
import { GET_LOG } from '@/endpoint/log/api';

export const Logs = ({ id, functionName }: { id: number; functionName: string }) => {
  return (
    <>
      <DataGridComponent
        columns={columnsLogs}
        defaultSearch={`?function=${functionName}&id=${id}&`}
        url={{
          url: `${GET_LOG}`,
        }}
        labelFilter='search'
      />
    </>
  );
};

export default Logs;
