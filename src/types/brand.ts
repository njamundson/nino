export type BrandType = 'business' | 'agency' | 'individual' | 'nonprofit';

export interface BrandData {
  id: string;
  userId: string;
  companyName: string;
  brandType: BrandType;
  description?: string;
  website?: string;
  instagram?: string;
  location?: string;
  phoneNumber?: string;
  supportEmail?: string;
  profileImageUrl?: string;
  smsNotificationsEnabled: boolean;
  twoFactorEnabled: boolean;
}

export const BRAND_TYPES: BrandType[] = ['business', 'agency', 'individual', 'nonprofit'];