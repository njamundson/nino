export interface BrandData {
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
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
  onboarding_completed?: boolean;
  email_notifications_enabled: boolean;
  push_notifications_enabled: boolean;
  application_notifications_enabled: boolean;
  message_notifications_enabled: boolean;
  marketing_notifications_enabled: boolean;
}

export interface Brand extends BrandData {
  created_at: string;
  updated_at: string;
}

export interface BrandSettings extends Brand {
  push_enabled: boolean;
  email_enabled: boolean;
  message_notifications: boolean;
  application_updates: boolean;
  marketing_updates: boolean;
}