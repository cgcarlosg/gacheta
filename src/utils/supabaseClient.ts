import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL) || 'https://mock-supabase-url.supabase.co'
const supabaseAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY) || 'mock-anon-key'

console.log('Supabase client initialized with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey)