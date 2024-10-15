const ROUTE_SETTING_APPROVAL = '/api/approval/setting';

export const GET_SETTING_APPROVAL = `${ROUTE_SETTING_APPROVAL}/list`;
export const CREATE_SETTING_APPROVAL = `${ROUTE_SETTING_APPROVAL}/create`;
export const EDIT_SETTING_APPROVAL = `${ROUTE_SETTING_APPROVAL}/update`;
export const DETAIL_SETTING_APPROVAL = (id: any) => `${ROUTE_SETTING_APPROVAL}/detail/${id}`;
export const DELET_SETTING_APPROVAL = `${ROUTE_SETTING_APPROVAL}/delete`;
