export interface CreatorData {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  specialties: string[];
  instagram: string;
  website: string;
  location: string;
  profileImage: string | null;
  creatorType: CreatorType;
  profile?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
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