import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qeodzqcywmrucahqxldg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlb2R6cWN5d21ydWNhaHF4bGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI0MDAsImV4cCI6MjAyNTM5ODQwMH0.qDPHvNxGUGSm8Ql_VHzNRtOXeZpjDSxfGXrqzIu_5Ek';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'nino-auth-token',
  },
});

// Add debug logging for initialization and auth state changes
console.log('Supabase client initialized with URL:', supabaseUrl);

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
  
  // Handle auth errors within the state change event
  if (event === 'ERROR') {
    console.error('Auth error occurred:', session);
  }
});