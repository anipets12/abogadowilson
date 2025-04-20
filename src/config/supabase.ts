import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : 
                     (typeof window !== 'undefined' ? window.__ENV__?.VITE_SUPABASE_URL : 
                     'https://phzldiaohelbyobhjrnc.supabase.co'));
const supabaseKey = (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_KEY : 
                     (typeof window !== 'undefined' ? window.__ENV__?.VITE_SUPABASE_KEY : 
                     'sbp_db5898ecc094d37ec87562399efe3833e63ab20f'));

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})
