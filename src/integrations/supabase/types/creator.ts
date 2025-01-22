import { Profile } from './auth';

export interface Creator {
  id: string;
  user_id: string;
  bio: string | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
  specialties: string[] | null;
  creator_type: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
  profile_id: string | null;
}

export interface CreatorProfile extends Creator {
  first_name: string | null;
  last_name: string | null;
}