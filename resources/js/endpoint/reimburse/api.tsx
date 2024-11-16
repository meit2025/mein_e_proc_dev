const ROUTE_REIMBURSE = '/api/reimburse';

export const LIST_REIMBURSE = `${ROUTE_REIMBURSE}/`;
export const STORE_REIMBURSE = `${ROUTE_REIMBURSE}/store`;
export const UPDATE_REIMBURSE = (id: any) => `${ROUTE_REIMBURSE}/update/${id}`;
export const DELETE_REIMBURSE = (id: any) => `${ROUTE_REIMBURSE}/delete/${id}`;