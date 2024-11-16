const ROUTE_API = '/api/allowance-category';

export const GET_LIST_ALLOWANCE_CATEGORY = `${ROUTE_API}/list`;
export const CREATE_API_ALLOWANCE_CATEGORY = `${ROUTE_API}/create`;
export const EDIT_API = `${ROUTE_API}/update`;
export const GET_DETAIL_ALLOWANCE_CATEGORY = (id: number) => `${ROUTE_API}/detail/${id}`;
export const UPDATE_ALLOWANCE_CATEGORY = (id: number) => `${ROUTE_API}/update/${id}`;
export const DELETE_ALLOWANCE_CATEGORY = `${ROUTE_API}/delete`;
