import DataGridComponent from '@/components/commons/DataGrid';
import { columnsLogs } from '../model/listModel';
import { GET_LOG } from '@/endpoint/log/api';

export const LogsLayout = ({ id }: { id: number }) => {
  return (
    <>
      <DataGridComponent
        columns={columnsLogs}
        defaultSearch={`?function=setApiPost&id=${id}&`}
        url={{
          url: `${GET_LOG}`,
        }}
        labelFilter='search'
      />
    </>
  );
};

export default LogsLayout;
