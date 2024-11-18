const ROUTE_MASTER_RECON = '/api/master/recon';

export const GET_MASTER_RECON = `${ROUTE_MASTER_RECON}/list`;
export const CREATE_MASTER_RECON = `${ROUTE_MASTER_RECON}/create`;
export const EDIT_MASTER_RECON = `${ROUTE_MASTER_RECON}/update`;
export const DETAIL_MASTER_RECON = (id: any) => `${ROUTE_MASTER_RECON}/detail/${id}`;
export const DELET_MASTER_RECON = `${ROUTE_MASTER_RECON}/delete`;
