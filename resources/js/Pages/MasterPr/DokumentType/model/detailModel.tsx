import AccountAssigmentLayout from '../components/AccountAssigment';
import MaterialNumberLayout from '../components/materialNumber';

export const labelsTabs = ['Account Assigmnet', 'Material Number'];
export const contentsTabs = (detail: any, id: number) => {
  return [
    <AccountAssigmentLayout key='Account Assigmnet' id={id} data={detail} />,
    <MaterialNumberLayout key='Material Number' id={id} />,
  ];
};
