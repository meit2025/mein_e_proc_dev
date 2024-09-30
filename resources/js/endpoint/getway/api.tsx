const ROUTE_API = '/api/api';

export const GET_API = `${ROUTE_API}/list`;
export const CREATE_API = `${ROUTE_API}/create`;
export const EDIT_API = `${ROUTE_API}/update`;
export const DETAIL_API = (id: any) => `${ROUTE_API}/detail/${id}`;
export const DELET_API = `${ROUTE_API}/delete`;
