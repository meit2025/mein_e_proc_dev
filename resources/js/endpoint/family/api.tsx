const ROUTE_API = '/api/master/family';

export const LIST_API_FAMILY = `${ROUTE_API}/`;
export const CREATE_API_FAMILY = `${ROUTE_API}/create`;
export const EDIT_FAMILY = (id: any) => `${ROUTE_API}/edit/${id}`;
export const UPDATE_FAMILY = (id: any) => `${ROUTE_API}/update/${id}`;
export const DESTROY_FAMILY = (id: any) => `${ROUTE_API}/destroy/${id}`;
