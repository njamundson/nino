export type BrandType = 'agency' | 'brand' | 'startup' | 'enterprise' | 'hotel';

export interface BrandData {
  company_name: string;
  brand_type: BrandType;
  description: string | null;
  website: string | null;
  instagram: string | null;
  location: string;
  phone_number: string | null;
  support_email: string | null;
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
}

export interface Brand {
  id: string;
  user_id: string;
  company_name: string | null;
  brand_type: BrandType | null;
  description: string | null;
  website: string | null;
  instagram: string | null;
  location: string | null;
  phone_number: string | null;
  support_email: string | null;
  profile_image_url: string | null;
  sms_notifications_enabled: boolean | null;
  two_factor_enabled: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface AccountManager {
  id: string;
  brand_id: string;
  user_id: string;
  role: string;
  invitation_status: string;
  name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}