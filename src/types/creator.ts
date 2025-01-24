export interface Creator {
  id: string;
  user_id: string;
  bio?: string;
  location?: string;
  instagram?: string;
  website?: string;
  specialties?: string[];
  creator_type?: string;
  profile_image_url?: string;
  first_name: string;
  last_name?: string;
  profile_id?: string;
  created_at?: string;
  updated_at?: string;
}