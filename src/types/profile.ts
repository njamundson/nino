export type ProfileWithAvatar = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean | null;
  avatarUrl?: string;
}