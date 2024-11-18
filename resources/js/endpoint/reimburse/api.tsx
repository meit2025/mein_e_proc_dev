const ROUTE_REIMBURSE = '/api/reimburse';

export const LIST_REIMBURSE = `${ROUTE_REIMBURSE}/`;
export const STORE_REIMBURSE = `${ROUTE_REIMBURSE}/store`;
export const UPDATE_REIMBURSE = (id: any) => `${ROUTE_REIMBURSE}/update/${id}`;
export const DELETE_REIMBURSE = (id: any) => `${ROUTE_REIMBURSE}/delete/${id}`;

export const DETAIL_REIMBURSE = (id: any) => `${ROUTE_REIMBURSE}/detail/${id}`;

export const GET_LIST_MASTER_REIMBUSE_TYPE = (type: string) =>
  `${ROUTE_REIMBURSE}/get-list-master-reimburse-type/${type}`;

// get - list - master - reimburse - type;
