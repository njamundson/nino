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
  deleted_at?: string | null;
  is_edited: boolean;
  read: boolean;
  message_type: string;
  media_url?: string | null;
  media_type?: string | null;
  profiles: CreatorProfile;
  sender?: CreatorProfile;
}

export interface NotificationBase {
  id: string;
  type: string;
  title: string;
  content: string;
  description: string;
  created_at: string;
  read: boolean;
  action_url: string;
}

export interface MessageNotification extends NotificationBase {
  type: 'message';
  data: Message;
}

export interface ApplicationNotification extends NotificationBase {
  type: 'application';
  data: {
    id: string;
    cover_letter: string;
    created_at: string;
    creator: {
      profile: CreatorProfile;
    };
    opportunity: {
      title: string;
    };
  };
}

export type Notification = MessageNotification | ApplicationNotification;

export interface CreatorFiltersProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  selectedLocations: string[];
  onSpecialtyChange: (specialty: string) => void;
  onCreatorTypeChange: (type: string | null) => void;
  onLocationChange: (location: string) => void;
  onInvite?: (creatorId: string) => void;
}