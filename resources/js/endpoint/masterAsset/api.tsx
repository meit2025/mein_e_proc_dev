const ROUTE_MASTER_ASSET = '/api/master/asset';

export const GET_MASTER_ASSET = `${ROUTE_MASTER_ASSET}/list`;
export const CREATE_MASTER_ASSET = `${ROUTE_MASTER_ASSET}/create`;
export const EDIT_MASTER_ASSET = `${ROUTE_MASTER_ASSET}/update`;
export const DETAIL_MASTER_ASSET = (id: any) => `${ROUTE_MASTER_ASSET}/detail/${id}`;
export const DELET_MASTER_ASSET = `${ROUTE_MASTER_ASSET}/delete`;
