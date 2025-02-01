export interface Creator {
  id: string;
  user_id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  instagram: string | null;
  website: string | null;
  creator_type: string;
  profile_image_url: string | null;
  display_name: string;
  created_at?: string;
  updated_at?: string;
  profile_id?: string | null;
  notifications_enabled?: boolean;
}