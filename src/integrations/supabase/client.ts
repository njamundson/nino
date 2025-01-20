import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qeodzqcywmrucahqxldg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlb2R6cWN5d21ydWNhaHF4bGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5Nzk1MDIsImV4cCI6MjA1MjU1NTUwMn0.WfvH4H2Vk3CNbXfYdxDzGVjVsl-WoCpdRJimdiAChXc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item;
        } catch (error) {
          console.error('Error accessing localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error setting localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    },
    flowType: 'pkce',
    debug: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Add debug logging for initialization and auth state changes
console.log('Supabase client initialized with URL:', supabaseUrl);

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
  
  if (!session) {
    console.log('No active session');
    return;
  }

  // Log successful authentication events
  if (event === 'SIGNED_IN') {
    console.log('User signed in successfully');
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
});