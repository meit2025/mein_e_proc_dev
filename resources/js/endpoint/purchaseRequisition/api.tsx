const ROUTE_PR = '/api/pr/purchase-requisition';

export const GET_PR = `${ROUTE_PR}/list`;
export const CREATE_PR = `${ROUTE_PR}/create`;
export const EDIT_PR = `${ROUTE_PR}/update`;
export const DETAIL_PR = (id: any) => `${ROUTE_PR}/detail/${id}`;
export const DELET_PR = `${ROUTE_PR}/delete`;
