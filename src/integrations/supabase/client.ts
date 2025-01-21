import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = 'https://vljmxspvxzmduewqzfra.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsam14c3B2eHptZHVld3F6ZnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg5NzE2MDAsImV4cCI6MjAyNDU0NzYwMH0.Nh83ebqzb7BwQTLiE6EEXlLv_4-yZhZJxwPZ-7wqXRo'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)