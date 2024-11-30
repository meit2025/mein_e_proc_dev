import { DetailLayout } from '../components/detail';
import { FamiliyLayout } from '../components/families';
import ResetPassword from '../components/resetPassword';

export const labelsTabs = ['Detail', 'Data Family', 'Reset Password'];
export const contentsTabs = (detail: any, id: number) => {
  return [
    <DetailLayout key='Detail' detail={detail} />,
    <FamiliyLayout key='value' id={id} />,
    <ResetPassword key='Reset Password' id={id} />,
  ];
};
