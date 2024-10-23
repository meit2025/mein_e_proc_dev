const ROUTE_REIMBURSE = '/api/reimburse';

export const GET_REIMBURSE = `${ROUTE_REIMBURSE}/list`;
export const CREATE_REIMBURSE = `${ROUTE_REIMBURSE}/create`;
export const EDIT_REIMBURSE = `${ROUTE_REIMBURSE}/update`;
export const DETAIL_REIMBURSE = (id: any) => `${ROUTE_REIMBURSE}/detail/${id}`;
export const DELETE_REIMBURSE = `${ROUTE_REIMBURSE}/delete`;
