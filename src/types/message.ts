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
  deleted_at?: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
  reactions?: {
    id: string;
    emoji: string;
    user_id: string;
  }[];
}