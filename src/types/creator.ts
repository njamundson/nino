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