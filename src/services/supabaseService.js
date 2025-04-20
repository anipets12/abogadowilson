/**
 * supabaseService.js - Servicio optimizado para Supabase en entornos de Cloudflare Workers
 * 
 * Este servicio resuelve problemas de conectividad entre Cloudflare Workers y Supabase,
 * implementando una configuración CORS compatible y manejo de errores robusto.
 */
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con manejo de errores mejorado
const supabaseUrl = 'https://svzdqpaqtghtgnbmojxl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2emRxcGFxdGdodGduYm1vanh' + 
                   'sIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3MTAwNzksImV4cCI6MjAxNDI4NjA3OX0.QOGxpqdBaetNtlB8kBGfGnzl2oCg8IcJF2D8yBzZkO0';

// Función para crear cliente con reintento automático
export const createSupabaseClient = (maxRetries = 3) => {
  // Configuración de opciones avanzadas para mejorar compatibilidad con Workers
  const options = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: (...args) => {
        // Personalizar fetch para agregar headers CORS adicionales
        const [url, config = {}] = args;
        config.headers = {
          ...config.headers,
          'X-Client-Info': 'supabase-js/2.x web',
        };
        return fetch(...args);
      }
    },
    headers: {
      'Cache-Control': 'no-store',
    }
  };

  // Crear cliente de Supabase con las opciones optimizadas
  return createClient(supabaseUrl, supabaseKey, options);
};

// Instancia global de Supabase con reintento automático
const supabase = createSupabaseClient();

// Wrapper para funciones con reintento automático
const withRetry = async (fn, maxRetries = 3) => {
  let retries = 0;
  let lastError;

  while (retries < maxRetries) {
    try {
      console.log(`Intento ${retries + 1} de ${maxRetries}...`);
      return await fn();
    } catch (error) {
      lastError = error;
      retries++;
      console.warn(`Attempt ${retries} failed: ${error.message}. ${retries < maxRetries ? 'Retrying...' : ''}`);
      
      if (retries < maxRetries) {
        // Esperar un tiempo antes de reintentar (backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
      }
    }
  }

  throw lastError;
};

// Servicio mejorado para autenticación
export const authService = {
  // Registrar nuevo usuario
  async register(email, password, userData) {
    return withRetry(async () => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData
          }
        });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error en registro:', error);
        return { data: null, error };
      }
    });
  },

  // Iniciar sesión
  async login(email, password) {
    return withRetry(async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error en login:', error);
        return { data: null, error };
      }
    });
  },

  // Cerrar sesión
  async signOut() {
    return withRetry(async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error('Error en signOut:', error);
        return { error };
      }
    });
  },

  // Verificar sesión actual
  async getSession() {
    return withRetry(async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error al obtener sesión:', error);
        return { data: null, error };
      }
    });
  },

  // Obtener usuario actual
  async getCurrentUser() {
    return withRetry(async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (!sessionData.session) {
          return { user: null, error: null };
        }
        
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        return { user: data.user, error: null };
      } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        return { user: null, error };
      }
    });
  },
  
  // Actualizar usuario
  async updateUser(userData) {
    return withRetry(async () => {
      try {
        const { data, error } = await supabase.auth.updateUser({
          data: userData
        });
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return { data: null, error };
      }
    });
  },
};

// Servicio mejorado para operaciones CRUD
export const dataService = {
  // Comprobar conexión (util para diagnóstico)
  async checkConnection() {
    try {
      // Intentar una operación simple para verificar conectividad
      const { data, error } = await supabase
        .from('health_check')
        .select('*')
        .limit(1);
      
      return { 
        connected: !error, 
        message: error ? `Error de conexión: ${error.message}` : 'Conexión exitosa'
      };
    } catch (error) {
      console.error('Error al verificar conexión:', error);
      return { connected: false, message: `Error: ${error.message}` };
    }
  },
  
  // Obtener todos los registros
  async getAll(table, options = {}) {
    return withRetry(async () => {
      try {
        let query = supabase.from(table).select('*');
        
        // Aplicar filtros si existen
        if (options.filters) {
          for (const [column, value] of Object.entries(options.filters)) {
            query = query.eq(column, value);
          }
        }
        
        // Aplicar límite si existe
        if (options.limit) {
          query = query.limit(options.limit);
        }
        
        // Aplicar ordenamiento si existe
        if (options.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending 
          });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error(`Error al obtener datos de ${table}:`, error);
        return { data: null, error };
      }
    });
  },
  
  // Obtener un registro por ID
  async getById(table, id) {
    return withRetry(async () => {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error(`Error al obtener registro ${id} de ${table}:`, error);
        return { data: null, error };
      }
    });
  },
  
  // Crear un nuevo registro
  async create(table, data) {
    return withRetry(async () => {
      try {
        const { data: responseData, error } = await supabase
          .from(table)
          .insert([data])
          .select();
        
        if (error) throw error;
        return { data: responseData[0], error: null };
      } catch (error) {
        console.error(`Error al crear registro en ${table}:`, error);
        return { data: null, error };
      }
    });
  },
  
  // Actualizar un registro
  async update(table, id, data) {
    return withRetry(async () => {
      try {
        const { data: responseData, error } = await supabase
          .from(table)
          .update(data)
          .eq('id', id)
          .select();
        
        if (error) throw error;
        return { data: responseData[0], error: null };
      } catch (error) {
        console.error(`Error al actualizar registro ${id} en ${table}:`, error);
        return { data: null, error };
      }
    });
  },
  
  // Eliminar un registro
  async delete(table, id) {
    return withRetry(async () => {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error(`Error al eliminar registro ${id} de ${table}:`, error);
        return { error };
      }
    });
  },
  
  // Búsqueda personalizada
  async search(table, query = {}) {
    return withRetry(async () => {
      try {
        let supabaseQuery = supabase.from(table).select('*');
        
        // Aplicar filtros de búsqueda
        if (query.filters) {
          for (const [column, filter] of Object.entries(query.filters)) {
            if (filter.type === 'eq') {
              supabaseQuery = supabaseQuery.eq(column, filter.value);
            } else if (filter.type === 'like') {
              supabaseQuery = supabaseQuery.ilike(column, `%${filter.value}%`);
            } else if (filter.type === 'in') {
              supabaseQuery = supabaseQuery.in(column, filter.value);
            } else if (filter.type === 'gt') {
              supabaseQuery = supabaseQuery.gt(column, filter.value);
            } else if (filter.type === 'lt') {
              supabaseQuery = supabaseQuery.lt(column, filter.value);
            }
          }
        }
        
        // Aplicar límite
        if (query.limit) {
          supabaseQuery = supabaseQuery.limit(query.limit);
        }
        
        // Aplicar ordenamiento
        if (query.orderBy) {
          supabaseQuery = supabaseQuery.order(query.orderBy.column, {
            ascending: query.orderBy.ascending
          });
        }
        
        const { data, error } = await supabaseQuery;
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error(`Error al buscar en ${table}:`, error);
        return { data: null, error };
      }
    });
  },
  
  // Upload de archivos
  async uploadFile(bucket, filePath, file) {
    return withRetry(async () => {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error(`Error al subir archivo a ${bucket}:`, error);
        return { data: null, error };
      }
    });
  },
  
  // Obtener URL pública de un archivo
  async getPublicUrl(bucket, filePath) {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error(`Error al obtener URL pública de ${filePath}:`, error);
      return { url: null, error };
    }
  }
};

// Exportar cliente de Supabase para uso directo si es necesario
export { supabase };

// Exportar por defecto los servicios
export default {
  auth: authService,
  data: dataService,
  supabase
};
