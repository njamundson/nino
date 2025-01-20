import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qeodzqcywmrucahqxldg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlb2R6cWN5d21ydWNhaHF4bGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5Nzk1MDIsImV4cCI6MjA1MjU1NTUwMn0.WfvH4H2Vk3CNbXfYdxDzGVjVsl-WoCpdRJimdiAChXc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    storage: window.localStorage
  }
});

// Add debug logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
  
  if (event === 'SIGNED_OUT' || !session) {
    console.log('No valid session, clearing local storage...');
    localStorage.clear();
    window.location.href = '/';
  }
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
});

// Handle network errors
window.addEventListener('online', async () => {
  console.log('Network connection restored, checking session...');
  const { data: { session }, error } = await supabase.auth.getSession();
  if (!session || error) {
    console.log('No valid session after network restore');
    localStorage.clear();
    window.location.href = '/';
  }
});