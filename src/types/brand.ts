export type BrandType = 'agency' | 'brand' | 'startup' | 'enterprise';

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

export interface Opportunity {
  id: string;
  brand_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  requirements: string[] | null;
  perks: string[] | null;
  compensation_type: string | null;
  compensation_amount: number | null;
  location: string | null;
  payment_details: string | null;
  compensation_details: string | null;
  deliverables: string[] | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  brand?: Brand;
}