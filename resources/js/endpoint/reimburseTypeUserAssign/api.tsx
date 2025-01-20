const ROUTE_API = '/api/master/reimburse-type-user-assign';

export const LIST_API_REIMBURSE_TYPE_USER_ASSIGN = (reimburseTypeId: any) => `${ROUTE_API}/${reimburseTypeId}`;
export const UPDATE_USER_ASSIGN_REIMBURSE_TYPE_USER_ASSIGN = (id: any) => `${ROUTE_API}/update-user-assign/${id}`;
export const UPDATE_BATCH_USER_ASSIGN_REIMBURSE_TYPE_USER_ASSIGN = `${ROUTE_API}/update-batch-user-assign`;