/**
 * Cliente de Supabase para uso en Cloudflare Workers
 * Proporciona acceso a las tablas de Supabase para datos de usuarios, consultas, citas, etc.
 */

import { createClient } from '@supabase/supabase-js';

export function supabase(env: any) {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Las variables de entorno SUPABASE_URL y SUPABASE_KEY son requeridas');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  });
}
