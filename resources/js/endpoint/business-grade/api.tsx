const ROUTE_API = '/api/business-grade';

export const GET_LIST_BUSINESS_TRIP_GRADE = `${ROUTE_API}/list`;
export const CREATE_API_BUSINESS_TRIP_GRADE = `${ROUTE_API}/create`;
export const EDIT_API = `${ROUTE_API}/update`;
export const GET_DETAIL_BUSINESS_TRIP_GRADE = (id: any) => `${ROUTE_API}/detail/${id}`;
export const UPDATE_BUSINESS_TRIP_GRADE = (id: any) => `${ROUTE_API}/update/${id}`;
export const DELETE_API_BUSINESS_GRADE = `${ROUTE_API}/delete`;
