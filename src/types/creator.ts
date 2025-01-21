export type CreatorType = 'solo' | 'agency' | 'brand';

export const CREATOR_TYPES: CreatorType[] = ['solo', 'agency', 'brand'];

export const CREATOR_SPECIALTIES = [
  'Photography',
  'Videography',
  'Content Creation',
  'Social Media Management',
  'Influencer Marketing',
  'Graphic Design',
  'Writing',
  'Music',
  'Animation'
] as const;

export interface CreatorProfile {
  first_name: string;
  last_name: string;
}

export interface CreatorData {
  id: string;
  user_id: string;
  bio: string;
  location: string;
  specialties: string[];
  instagram: string;
  website: string;
  profile_image_url: string;
  creator_type: CreatorType;
  profile: CreatorProfile;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string;
  timestamp: string;
  read: boolean;
  created_at: string;
  action_url?: string;
  data?: any;
}

export type BrandType = 'retail' | 'service' | 'technology' | 'food' | 'entertainment' | 'other';

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