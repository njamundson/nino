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

export interface MessageProfile {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  message_type: string;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  updated_at: string;
  sender_display_name: string;
  receiver_display_name: string;
}