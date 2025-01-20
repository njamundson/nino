import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qeodzqcywmrucahqxldg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlb2R6cWN5d21ydWNhaHF4bGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5Nzk1MDIsImV4cCI6MjA1MjU1NTUwMn0.WfvH4H2Vk3CNbXfYdxDzGVjVsl-WoCpdRJimdiAChXc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add debug logging for initialization and auth state changes
console.log('Supabase client initialized');

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
});