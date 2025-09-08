const ROUTE_APPROVAL_ROUTE = '/api/approval/route';
const ROUTE_APPROVAL_ROUTE_USERS = '/api/approval/approval-to-user';

export const GET_APPROVAL_ROUTE = `${ROUTE_APPROVAL_ROUTE}/list`;
export const CREATE_APPROVAL_ROUTE = `${ROUTE_APPROVAL_ROUTE}/create`;
export const EDIT_APPROVAL_ROUTE = `${ROUTE_APPROVAL_ROUTE}/update`;
export const DETAIL_APPROVAL_ROUTE = (id: any) => `${ROUTE_APPROVAL_ROUTE}/detail/${id}`;

export const DELET_APPROVAL_ROUTE = `${ROUTE_APPROVAL_ROUTE}/delete`;

export const DETAIL_APPROVAL_USER_DROPDOWN_ROUTE = (id: any, type: string) =>
  `${ROUTE_APPROVAL_ROUTE_USERS}/get-user-dropdown/${id}/${type}`;
export const CREATE_APPROVAL_USER_DROPDOWN_ROUTE = `${ROUTE_APPROVAL_ROUTE_USERS}/create`;
