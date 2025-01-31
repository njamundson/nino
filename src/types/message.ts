export interface Message {
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
  sender_profile_id: string | null;
  receiver_profile_id: string | null;
  sender?: {
    display_name: string;
  };
  receiver?: {
    display_name: string;
  };
}

export interface MessageProfile {
  id: string;
  sender_id: string | null;
  receiver_id: string | null;
  content: string | null;
  read: boolean | null;
  message_type: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  updated_at: string;
  sender_display_name: string | null;
  receiver_display_name: string | null;
}