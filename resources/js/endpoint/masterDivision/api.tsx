const ROUTE_MASTER_DIVISION = '/api/master/division';

export const GET_MASTER_DIVISION = `${ROUTE_MASTER_DIVISION}/list`;
export const CREATE_MASTER_DIVISION = `${ROUTE_MASTER_DIVISION}/create`;
export const EDIT_MASTER_DIVISION = `${ROUTE_MASTER_DIVISION}/update`;
export const DETAIL_MASTER_DIVISION = (id: any) => `${ROUTE_MASTER_DIVISION}/detail/${id}`;
export const DELET_MASTER_DIVISION = `${ROUTE_MASTER_DIVISION}/delete`;
