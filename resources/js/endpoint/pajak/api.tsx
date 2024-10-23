const ROUTE_MASTER_PAJAK = '/api/master-pr/pajak';

export const GET_MASTER_PAJAK = `${ROUTE_MASTER_PAJAK}/list`;
export const CREATE_MASTER_PAJAK = `${ROUTE_MASTER_PAJAK}/create`;
export const EDIT_MASTER_PAJAK = `${ROUTE_MASTER_PAJAK}/update`;
export const DETAIL_MASTER_PAJAK = (id: any) => `${ROUTE_MASTER_PAJAK}/detail/${id}`;
export const DELET_MASTER_PAJAK = `${ROUTE_MASTER_PAJAK}/delete`;
