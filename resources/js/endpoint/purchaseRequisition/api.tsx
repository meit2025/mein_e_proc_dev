const ROUTE_PR = '/api/pr/purchase-requisition';
const ROUTE_PR_sap = '/api/pr/purchase-requisition-sap';

export const GET_PR = `${ROUTE_PR}/list`;
export const CREATE_PR = `${ROUTE_PR}/create`;
export const EDIT_PR = `${ROUTE_PR}/update`;
export const DETAIL_PR = (id: any) => `${ROUTE_PR}/detail/${id}`;
export const DELET_PR = `${ROUTE_PR}/delete`;

export const GET_PR_SAP = `${ROUTE_PR_sap}/list`;
export const GET_DP_SAP = `${ROUTE_PR_sap}/list-dp`;
export const GET_PO_SAP = `${ROUTE_PR_sap}/list-po`;

export const SEND_PR_SAP = (id: any, type: string) => `${ROUTE_PR_sap}/downolad-text/${id}/${type}`;
export const SEND_PO_SAP = (id: any, type: string) =>
  `${ROUTE_PR_sap}/downolad-text-po/${id}/${type}`;
