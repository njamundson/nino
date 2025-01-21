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
];

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
  profile: {
    first_name: string;
    last_name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreatorProfile {
  first_name: string;
  last_name: string;
}