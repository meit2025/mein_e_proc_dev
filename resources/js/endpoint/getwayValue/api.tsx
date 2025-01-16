const ROUTE_GATEWAY_VALUE = '/api/value';

export const GET_GATEWAY_VALUE = `${ROUTE_GATEWAY_VALUE}/list`;
export const CREATE_GATEWAY_VALUE = `${ROUTE_GATEWAY_VALUE}/create`;
export const EDIT_GATEWAY_VALUE = `${ROUTE_GATEWAY_VALUE}/update`;
export const DETAIL_GATEWAY_VALUE = (id: any) => `${ROUTE_GATEWAY_VALUE}/detail/${id}`;
export const DELET_GATEWAY_VALUE = `${ROUTE_GATEWAY_VALUE}/delete`;
