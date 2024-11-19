import { DetailLayout } from '../components/detail';
import PermissionDropdownLayout from '../components/PermissionDropdown';

export const labelsTabs = ['Detail', 'Permission Dropdown'];
export const contentsTabs = (detail: any, id: number) => {
  return [
    <DetailLayout key='Detail' detail={detail} />,
    <PermissionDropdownLayout key='Permission Dropdown' id={id} />,
  ];
};
