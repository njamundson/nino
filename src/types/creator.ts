export type CreatorType = 'Model/Talent' | 'Photographer' | 'Videographer' | 'Content Creator';

export const CREATOR_TYPES: CreatorType[] = [
  'Model/Talent',
  'Photographer',
  'Videographer',
  'Content Creator'
];

export const CREATOR_SPECIALTIES = [
  'Fashion',
  'Beauty',
  'Lifestyle',
  'Travel',
  'Food',
  'Fitness',
  'Technology',
  'Gaming',
  'Entertainment',
  'Business',
  'Education',
  'Art',
  'Music',
  'Sports',
  'Automotive',
  'Parenting',
  'Pets',
  'Home & Decor',
  'DIY & Crafts'
];

export interface Creator {
  id: string;
  user_id: string;
  bio: string;
  location: string;
  specialties: string[];
  instagram: string;
  website: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  creator_type: CreatorType;
}

export interface CreatorData extends Creator {
  profile?: {
    first_name: string;
    last_name: string;
  } | null;
  created_at?: string;
  updated_at?: string;
  profile_id?: string | null;
  notifications_enabled?: boolean;
  onboarding_completed?: boolean;
}