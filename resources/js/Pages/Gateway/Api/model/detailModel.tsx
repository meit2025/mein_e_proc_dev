import { DetailLayout } from '../components/detail';
import { LogsLayout } from '../components/logs';
import { ValueLayout } from '../components/value';

export const labelsTabs = ['Detail', 'Value Parameter', 'Logs'];
export const contentsTabs = (detail: any) => {
  return [
    <DetailLayout key='Detail' detail={detail} />,
    <ValueLayout key='value' />,
    <LogsLayout key='logs' />,
  ];
};
