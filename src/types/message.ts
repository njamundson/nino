export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  read: boolean;
  message_type: string;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  updated_at: string;
  sender_profile_id: string;
  receiver_profile_id: string;
  deleted_at?: string;
  is_edited?: boolean;
  profiles: {
    first_name: string;
    last_name: string;
  };
  reactions?: {
    id: string;
    emoji: string;
    user_id: string;
  }[];
}