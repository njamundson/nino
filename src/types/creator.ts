export interface CreatorData {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  specialties: string[];
  instagram: string;
  website: string;
  location: string;
  profileImage: string | null;
  creatorType: CreatorType;
  profile_image_url: string | null;
  profile?: {
    display_name: string;
  } | null;
  notifications_enabled?: boolean;
}

export type CreatorType = 'solo' | 'couple' | 'family' | 'group';

export const CREATOR_TYPES = ['solo', 'couple', 'family', 'group'] as const;

export const CREATOR_SPECIALTIES = [
  'UGC Creator',
  'Videographer',
  'Photographer',
  'Model/Talent',
  'Public Relations/Writer'
] as const;

export interface Creator {
  id: string;
  user_id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  instagram: string | null;
  website: string | null;
  creator_type: CreatorType | null;
  profile_image_url: string | null;
  display_name: string;
  profile?: {
    display_name: string | null;
  } | null;
  created_at: string;
  updated_at: string;
  profile_id: string | null;
  onboarding_completed?: boolean;
  notifications_enabled?: boolean;
}

export const validateInstagramHandle = (handle: string): boolean => {
  const username = handle.startsWith('@') ? handle.slice(1) : handle;
  return /^[a-zA-Z0-9._]{1,30}$/.test(username);
};

export const validateWebsiteUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};