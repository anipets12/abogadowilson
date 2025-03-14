import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: async (key) => {
        const response = await fetch(`https://your-cloudflare-worker.com/get?key=${key}`);
        return response.text();
      },
      setItem: async (key, value) => {
        await fetch(`https://your-cloudflare-worker.com/set?key=${key}`, {
          method: 'POST',
          body: value
        });
      },
      removeItem: async (key) => {
        await fetch(`https://your-cloudflare-worker.com/delete?key=${key}`, {
          method: 'DELETE'
        });
      }
    }
  }
});

export default supabase;
