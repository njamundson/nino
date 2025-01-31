export interface UserProfile {
  id: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type { BrandSettings } from './brand';