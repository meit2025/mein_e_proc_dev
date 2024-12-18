const ROUTE_API = '/api/business-trip-declaration';

export const GET_LIST_BUSINESS_TRIP_DECLARATION = `${ROUTE_API}/list`;
export const CREATE_API_BUSINESS_TRIP_DECLARATION = `${ROUTE_API}/create`;
export const EDIT_API_BUSINESS_TRIP_DECLARATION = `${ROUTE_API}/update`;
export const GET_DETAIL_BUSINESS_TRIP_DECLARATION = (id: any) => `${ROUTE_API}/detail/${id}`;
export const GET_DETAIL_BUSINESS_TRIP_DECLARATION_PRINT = (id: any) =>
  `${ROUTE_API}/detail-bt/${id}`;
export const DELET_API = `${ROUTE_API}/delete`;
export const PRINT_API_BUSINESS_TRIP_DECLARATION = `${ROUTE_API}/print`;
