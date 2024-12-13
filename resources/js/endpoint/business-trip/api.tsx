const ROUTE_API = '/api/business-trip';

export const GET_LIST_BUSINESS_TRIP = `${ROUTE_API}/list`;
export const CREATE_API_BUSINESS_TRIP = `${ROUTE_API}/create`;
export const EDIT_API_BUSINESS_TRIP = `${ROUTE_API}/update`;
export const GET_DETAIL_BUSINESS_TRIP = (id: any) => `${ROUTE_API}/detail/${id}`;
export const GET_DETAIL_BUSINESS_TRIP_REQUEST = (id: any) => `${ROUTE_API}/detail-bt/${id}`;
export const DELET_API_BUSINESS_TRIP = `${ROUTE_API}/delete`;
export const PRINT_API_BUSINESS_TRIP = `${ROUTE_API}/print`;
export const GET_LIST_EMPLOYEE = `${ROUTE_API}/get-employee`;
export const GET_LIST_PURPOSE_TYPE = `${ROUTE_API}/get-purpose-type`;
export const GET_LIST_COST_CENTER = `${ROUTE_API}/get-cost-center`;
export const GET_LIST_DESTINATION = `${ROUTE_API}/get-destination`;
export const GET_LIST_TAX = `${ROUTE_API}/get-tax`;
export const GET_LIST_PURCHASING_GROUP = `${ROUTE_API}/get-purchasing-group`;
