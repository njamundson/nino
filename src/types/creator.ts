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
  user_id: string;
  bio: string;
  location: string;
  specialties: string[];
  instagram: string;
  website: string;
  profile_image_url: string;
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
  deleted_at?: string;
  is_edited: boolean;
  read: boolean;
  message_type: string;
  media_url?: string;
  media_type?: string;
  profiles: CreatorProfile;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string;
  timestamp: string;
  created_at: string;
  read: boolean;
  action_url: string;
  data?: any;
}