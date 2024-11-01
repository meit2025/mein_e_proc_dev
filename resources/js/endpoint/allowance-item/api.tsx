const ROUTE_API = '/api/allowance-item';

export const GET_LIST_ALLOWANCE_ITEM = `${ROUTE_API}/list`;
export const CREATE_API_ALLOWANCE_ITEM = `${ROUTE_API}/create`;
export const EDIT_API = `${ROUTE_API}/update`;
export const GET_DETAIL_ALLOWANCE_ITEM = (id: any) => `${ROUTE_API}/detail/${id}`;

export const UPDATE_ALLOWANCE_ITEM = (id: any) => `${ROUTE_API}/update/${id}`;

export const DELET_API = `${ROUTE_API}/delete`;
