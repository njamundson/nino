import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Replace this with your project URL from your Supabase settings
const supabaseUrl = 'https://vljmxspvxzmduewqzfra.supabase.co'

// Replace this with your anon/public key from your Supabase settings
const supabaseAnonKey = 'your-anon-key-here'

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
)