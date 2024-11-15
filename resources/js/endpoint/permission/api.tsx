const ROUTE_MASTER_PERMISSION = '/api/user-management/permission';

export const GET_MASTER_PERMISSION = `${ROUTE_MASTER_PERMISSION}/list`;
export const CREATE_MASTER_PERMISSION = `${ROUTE_MASTER_PERMISSION}/create`;
export const EDIT_MASTER_PERMISSION = `${ROUTE_MASTER_PERMISSION}/update`;
export const DETAIL_MASTER_PERMISSION = (id: any) => `${ROUTE_MASTER_PERMISSION}/detail/${id}`;
export const DELET_MASTER_PERMISSION = `${ROUTE_MASTER_PERMISSION}/delete`;
