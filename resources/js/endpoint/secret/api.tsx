const ROUTE_SECRET = '/api/secret';

export const GET_SECRET = `${ROUTE_SECRET}/list`;
export const CREATE_SECRET = `${ROUTE_SECRET}/create`;
export const EDIT_SECRET = `${ROUTE_SECRET}/update`;
export const DETAIL_SECRET = (id: any) => `${ROUTE_SECRET}/detail/${id}`;
export const DELET_SECRET = `${ROUTE_SECRET}/delete`;
