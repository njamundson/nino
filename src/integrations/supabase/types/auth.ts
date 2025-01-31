export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  display_name: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
  profile?: UserProfile;
}