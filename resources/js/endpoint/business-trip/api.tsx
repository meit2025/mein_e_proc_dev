const ROUTE_API = '/api/business-trip';

export const GET_LIST_BUSINESS_TRIP = `${ROUTE_API}/list`;
export const CREATE_API_BUSINESS_TRIP = `${ROUTE_API}/create`;
export const EDIT_API = `${ROUTE_API}/update`;
export const GET_DETAIL_BUSINESS_TRIP = (id: any) => `${ROUTE_API}/detail/${id}`;
export const DELET_API = `${ROUTE_API}/delete`;
