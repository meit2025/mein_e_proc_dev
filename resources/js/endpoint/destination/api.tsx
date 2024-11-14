const ROUTE_API = '/api/destination';

export const GET_LIST_DESTINATION = `${ROUTE_API}/list`;
export const CREATE_API_DESTINATION = `${ROUTE_API}/create`;
export const EDIT_API = `${ROUTE_API}/update`;
export const GET_DETAIL_DESTINATION = (id: any) => `${ROUTE_API}/detail/${id}`;
export const UPDATE_DESTINATION = (id: any) => `${ROUTE_API}/update/${id}`;
export const DELETE_API_DESTINATION = `${ROUTE_API}/delete`;
