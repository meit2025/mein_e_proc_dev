const ROUTE_API = '/api/master/reimburse-period';

export const GET_LIST_REIMBURSE_PERIOD = `${ROUTE_API}/list`;
export const STORE_REIMBURSE_PERIOD = `${ROUTE_API}/create`;
export const EDIT_REIMBURSE_PERIOD = (id: any) => `${ROUTE_API}/edit/${id}`;
export const UPDATE_REIMBURSE_PERIOD = (id: any) => `${ROUTE_API}/update/${id}`;
export const DESTROY_REIMBURSE_PERIOD = (id: any) => `${ROUTE_API}/destroy/${id}`;

