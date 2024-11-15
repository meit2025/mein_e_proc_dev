const ROUTE_API = '/api/master/reimburse-quota';

export const LIST_API_REIMBURSE_QUOTA = `${ROUTE_API}/`;
export const STORE_REIMBURSE_QUOTA = `${ROUTE_API}/create`;
export const EDIT_REIMBURSE_QUOTA = (id: any) => `${ROUTE_API}/edit/${id}`;
export const UPDATE_REIMBURSE_QUOTA = (id: any) => `${ROUTE_API}/update/${id}`;
export const DESTROY_REIMBURSE_QUOTA = `${ROUTE_API}/delete`;
