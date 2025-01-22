import { Profile } from './auth';

export interface Brand {
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
  sms_notifications_enabled: boolean | null;
  two_factor_enabled: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface BrandManager {
  id: string;
  brand_id: string;
  user_id: string;
  role: string;
  invitation_status: string | null;
  name: string | null;
  email: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BrandLoginHistory {
  id: string;
  brand_id: string;
  login_timestamp: string | null;
  ip_address: string | null;
  device_info: string | null;
}

export interface BrandNotificationSettings {
  id: string;
  brand_id: string;
  push_enabled: boolean | null;
  email_enabled: boolean | null;
  message_notifications: boolean | null;
  application_updates: boolean | null;
  marketing_updates: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}