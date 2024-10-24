const ROUTE_API = '/api/master/reimburse-period';

export const GET_LIST_REIMBURSE_PERIOD = `${ROUTE_API}/list`;
export const CREATE_API_REIMBURSE_PERIOD = `${ROUTE_API}/create`;
export const EDIT_API = `${ROUTE_API}/update`;
export const GET_DETAIL_REIMBURSE_PERIOD = (id: any) => `${ROUTE_API}/detail/${id}`;
export const DELET_API = `${ROUTE_API}/delete`;

// export const GET_LIST_ALLOWANCES_BY_REIMBURSE_PERIOD = (id: any) =>
//   `${ROUTE_API}/list-allowances-by-purpose-type/${id}`;


