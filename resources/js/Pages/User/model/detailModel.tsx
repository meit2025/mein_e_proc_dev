import { DetailLayout } from '../components/detail';
import { FamiliyLayout } from '../components/families';

export const labelsTabs = ['Detail', 'Data Family'];
export const contentsTabs = (detail: any, id: number) => {
  return [<DetailLayout key='Detail' detail={detail} />, <FamiliyLayout key='value' id={id} />];
};
