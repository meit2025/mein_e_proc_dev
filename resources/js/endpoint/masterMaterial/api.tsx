const ROUTE_MASTER_MATERIAL = '/api/master/master-material';

export const GET_MASTER_MATERIAL = `${ROUTE_MASTER_MATERIAL}/list`;
export const CREATE_MASTER_MATERIAL = `${ROUTE_MASTER_MATERIAL}/create`;
export const EDIT_MASTER_MATERIAL = `${ROUTE_MASTER_MATERIAL}/update`;
export const DETAIL_MASTER_MATERIAL = (id: any) => `${ROUTE_MASTER_MATERIAL}/detail/${id}`;
export const DELET_MASTER_MATERIAL = `${ROUTE_MASTER_MATERIAL}/delete`;
