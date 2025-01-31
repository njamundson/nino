export type CreatorType = 'solo' | 'agency' | 'brand';

export interface CreatorData {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  location: string;
  specialties: string[];
  creator_type: CreatorType;
  instagram: string;
  website: string;
  profile_image_url: string | null;
  notifications_enabled?: boolean;
  onboarding_completed?: boolean;
}

export interface Creator extends CreatorData {
  created_at: string;
  updated_at: string;
}