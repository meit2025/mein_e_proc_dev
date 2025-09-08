const ROUTE_API = '/api/business-trip';

export const GET_LIST_BUSINESS_TRIP = `${ROUTE_API}/list`;
export const CREATE_API_BUSINESS_TRIP = `${ROUTE_API}/create`;
export const EDIT_API_BUSINESS_TRIP = `${ROUTE_API}/update`;
export const GET_DETAIL_BUSINESS_TRIP = (id: any) => `${ROUTE_API}/detail/${id}`;
export const GET_DETAIL_BUSINESS_TRIP_REQUEST = (id: any) => `${ROUTE_API}/detail-bt/${id}`;
export const DELET_API_BUSINESS_TRIP = `${ROUTE_API}/delete`;
export const PRINT_API_BUSINESS_TRIP = `${ROUTE_API}/print`;
export const GET_DATE_BUSINESS_TRIP_BY_USER = (user_id: any) => `${ROUTE_API}/get-date-byuser/${user_id}`;
export const CLONE_API_BUSINESS_TRIP = `${ROUTE_API}/clone-store`;
export const GET_LIST_USER_BUSINESS_TRIP = `${ROUTE_API}/get-user-business-trip`;
