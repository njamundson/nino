export interface BrandSettings {
  brand_type: string;
  company_name: string;
  description: string | null;
  website: string | null;
  instagram: string | null;
  location: string;
  phone_number: string | null;
  support_email: string | null;
  profile_image_url: string | null;
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
}

export type BrandType = 'hotel' | 'restaurant' | 'retail' | 'other';

export interface BrandData extends BrandSettings {
  id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}