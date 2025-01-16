const ROUTE_MASTER_BANK_KEY = '/api/master/bank-key';

export const GET_MASTER_BANK_KEY = `${ROUTE_MASTER_BANK_KEY}/list`;
export const CREATE_MASTER_BANK_KEY = `${ROUTE_MASTER_BANK_KEY}/create`;
export const EDIT_MASTER_BANK_KEY = `${ROUTE_MASTER_BANK_KEY}/update`;
export const DETAIL_MASTER_BANK_KEY = (id: any) => `${ROUTE_MASTER_BANK_KEY}/detail/${id}`;
export const DELET_MASTER_BANK_KEY = `${ROUTE_MASTER_BANK_KEY}/delete`;
