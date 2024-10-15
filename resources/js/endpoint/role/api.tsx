const ROUTE_ROLE = '/api/role';

export const GET_ROLE = `${ROUTE_ROLE}/list`;
export const CREATE_ROLE = `${ROUTE_ROLE}/create`;
export const EDIT_ROLE = `${ROUTE_ROLE}/update`;
export const DETAIL_ROLE = (id: any) => `${ROUTE_ROLE}/detail/${id}`;
export const DELET_ROLE = `${ROUTE_ROLE}/delete`;
