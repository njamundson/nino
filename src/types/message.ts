export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean | null;
  message_type: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  sender_profile_id?: string | null;
  receiver_profile_id?: string | null;
  sender?: {
    display_name: string;
  };
  receiver?: {
    display_name: string;
  };
}

export interface MessageProfile extends Message {
  sender_display_name: string | null;
  receiver_display_name: string | null;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string | null;
}

export interface TypingStatus {
  id: string;
  user_id: string;
  chat_with: string;
  is_typing: boolean | null;
  updated_at: string | null;
}