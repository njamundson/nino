export type CreatorType = "solo" | "agency" | "brand";

export interface CreatorData {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  creator_type: CreatorType;
  instagram: string | null;
  website: string | null;
  profile_image_url: string | null;
  notifications_enabled?: boolean;
  onboarding_completed?: boolean;
  profile_id?: string | null;
}

export interface Creator extends CreatorData {
  created_at: string;
  updated_at: string;
}

export const CREATOR_TYPES = [
  { value: 'solo', label: 'Solo Creator' },
  { value: 'agency', label: 'Agency' },
  { value: 'brand', label: 'Brand' }
] as const;

export const CREATOR_SPECIALTIES = [
  'Photography',
  'Videography',
  'Content Creation',
  'Social Media',
  'Writing',
  'Design',
  'Marketing',
  'Consulting'
] as const;