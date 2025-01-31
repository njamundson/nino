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
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
}