const ROUTE_MASTER_POSITION = '/api/master/position';

export const GET_MASTER_POSITION = `${ROUTE_MASTER_POSITION}/list`;
export const CREATE_MASTER_POSITION = `${ROUTE_MASTER_POSITION}/create`;
export const EDIT_MASTER_POSITION = `${ROUTE_MASTER_POSITION}/update`;
export const DETAIL_MASTER_POSITION = (id: any) => `${ROUTE_MASTER_POSITION}/detail/${id}`;
export const DELET_MASTER_POSITION = `${ROUTE_MASTER_POSITION}/delete`;
