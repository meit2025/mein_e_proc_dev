const ROUTE_MASTER_CURRENCY = '/api/master-pr/currency';

export const GET_MASTER_CURRENCY = `${ROUTE_MASTER_CURRENCY}/list`;
export const CREATE_MASTER_CURRENCY = `${ROUTE_MASTER_CURRENCY}/create`;
export const EDIT_MASTER_CURRENCY = `${ROUTE_MASTER_CURRENCY}/update`;
export const DETAIL_MASTER_CURRENCY = (id: any) => `${ROUTE_MASTER_CURRENCY}/detail/${id}`;
export const DELET_MASTER_CURRENCY = `${ROUTE_MASTER_CURRENCY}/delete`;
