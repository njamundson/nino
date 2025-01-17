import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qeodzqcywmrucahqxldg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlb2R6cWN5d21ydWNhaHF4bGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI0MDAsImV4cCI6MjAyNTM5ODQwMH0.qDPHvNxGUGSm8Ql_VHzNRtOXeZpjDSxfGXrqzIu_5Ek';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});