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