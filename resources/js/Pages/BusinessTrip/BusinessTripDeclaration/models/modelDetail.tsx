export interface BusinessTripDeclaration {
  id: number;
  purpose_type_id: number;
  request_no: string;
  request_for: RequestFor;
  created_by: number;
  remarks: string;
  total_destination: number;
  deleted_at: any;
  type: string;
  cash_advance: number;
  total_percent: any;
  total_cash_advance: any;
  parent_id: number;
  cost_center_id: any;
  pajak_id: any;
  purchasing_group_id: any;
  uom_id: any;
  name_request: string;
  name_purpose: string;
  destinations: Destination[];
  cost_center: any;
  pajak: any;
  purchasing_group: any;
  purpose_type: PurposeType;
  business_trip_destination: BusinessTripDestination[];
}

export interface RequestFor {
  id: number;
  nip: string;
  name: string;
  email: string;
  role: string;
  job_level: string;
  division: string;
  immediate_spv: string;
  email_verified_at: any;
  created_at: string;
  updated_at: string;
  username: string;
  is_admin: string;
  master_business_partner_id: string;
}

export interface Destination {
  destination: string;
  business_trip_start_date: string;
  business_trip_end_date: string;
  detail_attedances: DetailAttedance[];
  allowances: Allowance[];
  allowancesResultItem: AllowancesResultItem[];
}

export interface DetailAttedance {
  id: number;
  business_trip_id: number;
  business_trip_destination_id: number;
  shift_code: string;
  shift_end: string;
  shift_start: string;
  start_time: string;
  end_time: string;
  date: string;
}

export interface Allowance {
  name: string;
  code: string;
  default_price: string;
  type: string;
  subtotal: string;
  currency: any;
  request_value: string;
  detail: Detail[];
}

export interface Detail {
  date: string;
  request_price: string;
}

export interface AllowancesResultItem {
  name: string;
  code: string;
  default_price: string;
  type: string;
  subtotal: string;
  currency: any;
  request_value: string;
  detail: Detail2[];
}

export interface Detail2 {
  date: any;
  request_price: string;
}

export interface PurposeType {
  id: number;
  name: string;
  deleted_at: any;
  created_at: string;
  updated_at: string;
  code: string;
  attedance_status: string;
}

export interface BusinessTripDestination {
  id: number;
  destination: string;
  business_trip_start_date: string;
  business_trip_end_date: string;
  business_trip_id: number;
  created_at: string;
  updated_at: string;
  get_detail_destination_day: GetDetailDestinationDay[];
  detail_destination_total: any[];
  detail_destination_day: DetailDestinationDay[];
  detail_attendance: DetailAttendance[];
}

export interface GetDetailDestinationDay {
  id: number;
  date: string;
  business_trip_destination_id: number;
  business_trip_id: number;
  price: string;
  deleted_at: any;
  created_at: string;
  updated_at: string;
  allowance_item_id: number;
  standard_value: string;
  percentage: any;
  allowance: Allowance2;
}

export interface Allowance2 {
  id: number;
  type: string;
  fixed_value: any;
  max_value: any;
  request_value: string;
  formula: string;
  currency_id: string;
  allowance_category_id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  grade_option: string;
  grade_all_price: string;
  material_number: string;
  material_group: string;
  grade_price: string;
}

export interface DetailDestinationDay {
  business_trip_destination_id: number;
  allowance_item_id: number;
  price: string;
  total: number;
  allowance: Allowance3;
}

export interface Allowance3 {
  id: number;
  type: string;
  fixed_value: any;
  max_value: any;
  request_value: string;
  formula: string;
  currency_id: string;
  allowance_category_id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  grade_option: string;
  grade_all_price: string;
  material_number: string;
  material_group: string;
  grade_price: string;
}

export interface DetailAttendance {
  id: number;
  business_trip_id: number;
  business_trip_destination_id: number;
  shift_code: string;
  shift_end: string;
  shift_start: string;
  start_time: string;
  end_time: string;
  date: string;
}
