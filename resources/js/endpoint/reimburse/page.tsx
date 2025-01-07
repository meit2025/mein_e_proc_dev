const ROUTE_REIMBURSE_PAGE = '/reimburse';

export const PAGE_REIMBURSE = `${ROUTE_REIMBURSE_PAGE}`;
export const PAGE_MY_REIMBURSE = `${ROUTE_REIMBURSE_PAGE}/my-reimburse`;
export const MY_REIMBURSE_LIST = (isEmployee: any) => `${ROUTE_REIMBURSE_PAGE}/my-reimburse/${isEmployee}`;
export const PAGE_EDIT_REIMBURSE = (id: any) => `${ROUTE_REIMBURSE_PAGE}/edit/${id}`;
