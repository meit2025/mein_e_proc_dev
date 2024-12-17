import UserAssigmentLayout from '../components/UserAssigmentLayout';
export const labelsTabs = ['Account Assigmnet'];
export const contentsTabs = (detail: any, id: number) => {
  return [<UserAssigmentLayout key='Account Assigmnet' id={id} data={detail} />];
};
