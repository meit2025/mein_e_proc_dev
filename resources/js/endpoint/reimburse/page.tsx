const ROUTE_REIMBURSE_PAGE = '/reimburse';

export const PAGE_REIMBURSE = `${ROUTE_REIMBURSE_PAGE}`;
export const PAGE_MY_REIMBURSE = `${ROUTE_REIMBURSE_PAGE}/my-reimburse`;
export const MY_REIMBURSE_LIST = (isEmployee: any) => `${ROUTE_REIMBURSE_PAGE}/my-reimburse/${isEmployee}`;
export const FAMILY_BALANCE_REIMBURSE_LIST = (id: any, relation: any, maximumBalance: any) => `${ROUTE_REIMBURSE_PAGE}/my-reimburse/balance-family-reimburse/${id}/${relation}/${maximumBalance}`;
export const PAGE_EDIT_REIMBURSE = (id: any) => `${ROUTE_REIMBURSE_PAGE}/edit/${id}`;
export const PAGE_DETAIL_REIMBURSE = `${ROUTE_REIMBURSE_PAGE}/detail`;
export const PAGE_PRINT_REIMBURSE = `${ROUTE_REIMBURSE_PAGE}/print`;
export const CLONE_REIMBURSE = `${ROUTE_REIMBURSE_PAGE}/clone`;
