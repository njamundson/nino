export type BrandType = "hotel" | "resort" | "travel_agency";

export interface BrandData {
  company_name: string;
  brand_type: BrandType;
  description: string;
  website: string | null;
  instagram: string | null;
  location: string;
  phone_number: string | null;
  support_email: string | null;
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
}

export interface LoginHistory {
  id: string;
  login_timestamp: string;
  ip_address: string;
  device_info: string;
}