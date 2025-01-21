export type CreatorType = 'solo' | 'agency' | 'brand';

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