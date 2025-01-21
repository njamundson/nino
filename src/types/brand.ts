export type BrandType = 'retail' | 'service' | 'technology' | 'other';

export interface BrandData {
  id: string;
  user_id: string;
  company_name: string;
  brand_type: BrandType;
  description: string;
  website: string;
  instagram: string;
  location: string;
  phone_number: string;
  support_email: string;
  profile_image_url: string;
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginHistory {
  id: string;
  brand_id: string;
  login_timestamp: string;
  ip_address: string;
  device_info: string;
}

export interface BrandSettingsData {
  brandData: BrandData;
  loginHistory: LoginHistory[];
  loading: boolean;
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  setBrandData: (data: Partial<BrandData>) => void;
  handleSave: () => Promise<void>;
  updateBrandData: (updates: Partial<BrandData>) => Promise<void>;
}