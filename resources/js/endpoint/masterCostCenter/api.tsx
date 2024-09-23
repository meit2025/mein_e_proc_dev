const ROUTE_MASTER_COST_CENTER = '/api/master/cost-center';

export const GET_MASTER_COST_CENTER = `${ROUTE_MASTER_COST_CENTER}/list`;
export const CREATE_MASTER_COST_CENTER = `${ROUTE_MASTER_COST_CENTER}/create`;
export const EDIT_MASTER_COST_CENTER = `${ROUTE_MASTER_COST_CENTER}/update`;
export const DETAIL_MASTER_COST_CENTER = (id: any) => `${ROUTE_MASTER_COST_CENTER}/detail/${id}`;
export const DELET_MASTER_COST_CENTER = `${ROUTE_MASTER_COST_CENTER}/delete`;
