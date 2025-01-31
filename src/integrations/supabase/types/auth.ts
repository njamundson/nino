export interface Profile {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: {
      display_name?: string;
    };
    identities: {
      id: string;
      user_id: string;
      identity_data: {
        email: string;
        sub: string;
      };
      provider: string;
      last_sign_in_at: string;
      created_at: string;
      updated_at: string;
    }[];
    created_at: string;
    updated_at: string;
  };
}