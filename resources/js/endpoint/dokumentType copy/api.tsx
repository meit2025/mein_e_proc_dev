const ROUTE_MASTER_DROPDOWN = '/api/master-pr/data-dropdown';

export const GET_MASTER_DROPDOWN = `${ROUTE_MASTER_DROPDOWN}/list`;
export const CREATE_MASTER_DROPDOWN = `${ROUTE_MASTER_DROPDOWN}/create`;
export const EDIT_MASTER_DROPDOWN = `${ROUTE_MASTER_DROPDOWN}/update`;
export const DETAIL_MASTER_DROPDOWN = (id: any) => `${ROUTE_MASTER_DROPDOWN}/detail/${id}`;
export const DELET_MASTER_DROPDOWN = `${ROUTE_MASTER_DROPDOWN}/delete`;
