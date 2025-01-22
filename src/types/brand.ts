export interface BrandData {
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
}

export interface BrandSettings extends BrandData {
  loading?: boolean;
  onUpdateField?: (field: string, value: any) => void;
}

export interface SecuritySettingsProps {
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
  onUpdateField: (field: string, value: any) => void;
}