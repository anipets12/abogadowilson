import { createClient } from '@supabase/supabase-js';

// Fix the URL to match the format expected by Supabase
const supabaseUrl = 'https://svzdqpaqtghtgnbmojxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2emRxcGFxdGdodGdubm1vanhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTE0NzE5OTEsImV4cCI6MTk2NzA0Nzk5MX0.OqH_m0RTfF0ROhjBU3p9RoNYi8T9xSVsQRoAYRCG4DY';

// Create the Supabase client with proper configuration for Cloudflare
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Use a cross-browser compatible approach for storage
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  // Add these settings to fix CORS and network issues
  global: {
    fetch: fetch,
    headers: {
      'X-Client-Info': 'supabase-js/2.0.0',
    },
  },
});

export default supabase;
