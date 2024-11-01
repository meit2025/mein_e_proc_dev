const ROUTE_API = '/api/purpose-type';

export const GET_LIST_PURPOSE_TYPE = `${ROUTE_API}/list`;
export const CREATE_API_PURPOSE_TYPE = `${ROUTE_API}/create`;
export const EDIT_API = `${ROUTE_API}/update`;
export const GET_DETAIL_PURPOSE_TYPE = (id: any) => `${ROUTE_API}/detail/${id}`;
export const UPDATE_PURPOSE_TYPE = (id: any) => `${ROUTE_API}/update/${id}`;
export const DELET_API = `${ROUTE_API}/delete`;
export const GET_LIST_ALLOWANCES_BY_PURPOSE_TYPE = (id: any, userid: any) =>
  `${ROUTE_API}/list-allowances-by-purpose-type/${id}/${userid}`;
