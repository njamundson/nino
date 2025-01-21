export type CreatorType = 'solo' | 'agency' | 'brand';

export const CREATOR_TYPES: CreatorType[] = ['solo', 'agency', 'brand'];

export const CREATOR_SPECIALTIES = [
  'Photography',
  'Videography',
  'Content Creation',
  'Social Media Management',
  'Influencer Marketing',
  'Graphic Design',
  'Writing',
  'Music',
  'Animation'
] as const;

export interface CreatorProfile {
  first_name: string;
  last_name: string;
}

export interface CreatorData {
  id: string;
  user_id?: string;
  bio: string | null;
  location: string | null;
  specialties: string[];
  instagram: string | null;
  website: string | null;
  profile_image_url: string | null;
  creator_type: CreatorType;
  profile: CreatorProfile;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
  is_edited: boolean;
  read: boolean;
  message_type: string;
  media_url?: string | null;
  media_type?: string | null;
  profiles: CreatorProfile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface BasicInfoStepProps {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  profileImage: string | null;
  onUpdateField: (field: string, value: string) => void;
  onUpdateImage: (image: string | null) => void;
}

export interface ProfessionalInfoStepProps {
  creatorType: CreatorType;
  skills: string[];
  onUpdateField: (field: string, value: string) => void;
  onUpdateSkills: (skills: string[]) => void;
}

export interface CreatorFiltersProps {
  selectedSpecialties: string[];
  selectedCreatorType: string;
  selectedLocations: string[];
  onInvite: (creatorId: string) => void;
}