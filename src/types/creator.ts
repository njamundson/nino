export type CreatorType = "solo" | "agency" | "brand";

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
  created_at?: string;
  updated_at?: string;
}

export interface Creator extends CreatorData {
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  read: boolean;
  message_type: string;
  updated_at: string;
  media_url: string | null;
  media_type: string | null;
  sender_profile_id: string | null;
  receiver_profile_id: string | null;
  profiles: {
    display_name: string;
  };
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

export const validateInstagramHandle = (handle: string): boolean => {
  const instagramRegex = /^@?[a-zA-Z0-9._]+$/;
  return instagramRegex.test(handle);
};

export const validateWebsiteUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};