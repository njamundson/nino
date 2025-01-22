export interface BrandData {
  id?: string;
  user_id: string;
  company_name: string;
  brand_type: string;
  description: string;
  website: string | null;
  instagram: string | null;
  location: string;
  phone_number: string | null;
  support_email: string | null;
  profile_image_url: string | null;
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BrandSettings extends BrandData {
  loading?: boolean;
}

export interface SecuritySettingsProps {
  two_factor_enabled: boolean;
  sms_notifications_enabled: boolean;
  onUpdateField: (field: string, value: any) => void;
  loginHistory?: Array<any>;
}