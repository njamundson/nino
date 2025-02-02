import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gyblvulifbqgrphlkkix.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Ymx2dWxpZmJxZ3JwaGxra2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1MDI5NDYsImV4cCI6MjA1MzA3ODk0Nn0.hXn9rCJkPHH8_K0eJmAhlhPJIRQnrZ5V4-LHpRZWelI";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: localStorage,
      storageKey: 'supabase.auth.token'
    }
  }
);