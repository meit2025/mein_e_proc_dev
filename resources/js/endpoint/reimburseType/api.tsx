const ROUTE_API = '/api/master/reimburse-type';

export const LIST_API_REIMBURSE_TYPE = `${ROUTE_API}/`;
export const LIST_API_USER_GRADE_REIMBURSE_TYPE = (id: any) => `${ROUTE_API}/listUserGrade/${id}`;
export const CREATE_API_REIMBURSE_TYPE = `${ROUTE_API}/create`;
export const EDIT_REIMBURSE_TYPE = (id: any) => `${ROUTE_API}/edit/${id}`;
export const UPDATE_REIMBURSE_TYPE = (id: any) => `${ROUTE_API}/update/${id}`;
export const DELETE_REIMBURSE_TYPE = `${ROUTE_API}/delete`;
