const ROUTE_MASTER_ORDER = '/api/master/order';

export const GET_MASTER_ORDER = `${ROUTE_MASTER_ORDER}/list`;
export const CREATE_MASTER_ORDER = `${ROUTE_MASTER_ORDER}/create`;
export const EDIT_MASTER_ORDER = `${ROUTE_MASTER_ORDER}/update`;
export const DETAIL_MASTER_ORDER = (id: any) => `${ROUTE_MASTER_ORDER}/detail/${id}`;
export const DELET_MASTER_ORDER = `${ROUTE_MASTER_ORDER}/delete`;
