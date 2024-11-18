const ROUTE_MASTER_UOM = '/api/master-pr/uom';

export const GET_MASTER_UOM = `${ROUTE_MASTER_UOM}/list`;
export const CREATE_MASTER_UOM = `${ROUTE_MASTER_UOM}/create`;
export const EDIT_MASTER_UOM = `${ROUTE_MASTER_UOM}/update`;
export const DETAIL_MASTER_UOM = (id: any) => `${ROUTE_MASTER_UOM}/detail/${id}`;
export const DELET_MASTER_UOM = `${ROUTE_MASTER_UOM}/delete`;
