export type BrandType = 'retail' | 'hotel' | 'restaurant' | 'service' | 'other';

export interface BrandData {
  id: string;
  user_id?: string;
  company_name: string;
  brand_type: BrandType;
  description: string | null;
  website: string | null;
  instagram: string | null;
  location: string | null;
  phone_number: string | null;
  support_email: string | null;
  profile_image_url: string | null;
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BrandOnboardingProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  profileImage: string | null;
  brandData: BrandData;
  updateField: (field: keyof BrandData, value: any) => void;
  setProfileImage: (image: string | null) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => Promise<void>;
}