import { createClient } from '@supabase/supabase-js';

// URL y clave de API de Supabase
const supabaseUrl = 'https://svzdqpaqtghtgnbmojxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2emRxcGFxdGdodGdubm1vanhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTE0NzE5OTEsImV4cCI6MTk2NzA0Nzk5MX0.OqH_m0RTfF0ROhjBU3p9RoNYi8T9xSVsQRoAYRCG4DY';

// Configuración personalizada para el fetch
const customFetch = async (url, options = {}) => {
  try {
    // Incluir credenciales para manejo de cookies CORS
    const fetchOptions = {
      ...options,
      credentials: 'include',
      // Asegurar que los headers estén establecidos y son correctos
      headers: {
        ...options.headers,
        'X-Client-Info': 'supabase-js/2.5.0',
      },
    };

    // Implementar un mecanismo de reintento para problemas de red
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const response = await fetch(url, fetchOptions);
        return response;
      } catch (error) {
        console.warn(`Error de red al conectar con Supabase, reintentando (${retries} intentos restantes)...`, error);
        lastError = error;
        retries--;
        // Esperar antes de reintentar (backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, 3 - retries)));
      }
    }
    throw lastError;
  } catch (error) {
    console.error('Error al conectar con Supabase:', error);
    throw error;
  }
};

// Crear el cliente de Supabase con configuración mejorada
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Usar un enfoque compatible con múltiples navegadores
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    fetch: customFetch,
    headers: {
      'X-Client-Info': 'supabase-js/2.5.0',
    },
  },
});

// Utilidad para verificar la conexión con Supabase
export const testSupabaseConnection = async () => {
  try {
    // Intenta una operación simple para verificar la conexión
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Error al verificar la conexión con Supabase:', error);
      return { success: false, error };
    } else {
      console.log('Conexión a Supabase establecida correctamente');
      return { success: true };
    }
  } catch (error) {
    console.error('Error al verificar la conexión con Supabase:', error);
    return { success: false, error };
  }
};

export default supabase;
