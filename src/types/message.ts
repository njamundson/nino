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
  deleted_at?: string;
  sender_profile: {
    first_name: string;
    last_name: string;
  };
  receiver_profile: {
    first_name: string;
    last_name: string;
  };
  reactions?: { emoji: string; user_id: string }[];
}