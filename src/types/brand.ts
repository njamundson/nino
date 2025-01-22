export interface BrandSettings {
  id?: string;
  user_id: string;
  company_name?: string;
  brand_type?: string;
  description?: string;
  website?: string;
  instagram?: string;
  location?: string;
  phone_number?: string;
  support_email?: string;
  profile_image_url?: string;
  sms_notifications_enabled?: boolean;
  two_factor_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SecuritySettingsProps {
  two_factor_enabled: boolean;
  sms_notifications_enabled: boolean;
  onUpdateField: (field: string, value: any) => void;
  loginHistory?: any[];
}