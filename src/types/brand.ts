export interface BrandSettings {
  id: string;
  user_id: string;
  company_name: string | null;
  brand_type: string | null;
  description: string | null;
  website: string | null;
  instagram: string | null;
  location: string | null;
  phone_number: string | null;
  support_email: string | null;
  profile_image_url: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
  email_notifications_enabled: boolean;
  push_notifications_enabled: boolean;
  application_notifications_enabled: boolean;
  message_notifications_enabled: boolean;
  marketing_notifications_enabled: boolean;
}

export type BrandData = Omit<BrandSettings, 'created_at' | 'updated_at'>;