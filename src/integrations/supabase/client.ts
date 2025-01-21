import { createClient } from '@supabase/supabase-js';

// For local development, we'll use mock values
const supabaseUrl = 'http://localhost:3000';
const supabaseKey = 'local-dev-key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
    storage: localStorage,
    storageKey: 'auth.token',
    detectSessionInUrl: false
  }
});

// Mock auth methods for local development
const mockAuth = {
  async signIn(email: string, password: string) {
    const mockUser = {
      id: '123',
      email,
      user_metadata: {
        first_name: 'Test',
        last_name: 'User'
      }
    };
    localStorage.setItem('auth.token', JSON.stringify({ user: mockUser }));
    return { data: { user: mockUser }, error: null };
  },

  async signOut() {
    localStorage.removeItem('auth.token');
    return { error: null };
  },

  async getUser() {
    const session = localStorage.getItem('auth.token');
    if (session) {
      return { data: { user: JSON.parse(session).user }, error: null };
    }
    return { data: { user: null }, error: null };
  }
};

// Override Supabase auth methods with mock implementations
supabase.auth = {
  ...supabase.auth,
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    return mockAuth.signIn(email, password);
  },
  signOut: async () => mockAuth.signOut(),
  getUser: async () => mockAuth.getUser(),
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // Simple mock of auth state change
    const unsubscribe = () => {};
    return { data: { subscription: { unsubscribe } }, error: null };
  }
} as any;