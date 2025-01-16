const ROUTE_USER = '/api/user';

export const GET_USER = `${ROUTE_USER}/list`;
export const CREATE_USER = `${ROUTE_USER}/create`;
export const EDIT_USER = `${ROUTE_USER}/update`;
export const EDIT_USER_PASSWORD = `${ROUTE_USER}/change-password`;
export const DETAIL_USER = (id: any) => `${ROUTE_USER}/detail/${id}`;
export const DELET_USER = `${ROUTE_USER}/delete`;
