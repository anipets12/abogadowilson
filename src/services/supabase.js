import { supabase } from '../config/supabase';

// Función para implementar reintentos
const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${i + 1} failed: ${error.message}. Retrying...`);
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
};

// Métodos de autenticación
export const signUp = async (email, password, userData) => {
  try {
    const result = await withRetry(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      return { data };
    });
    
    return { user: result.data.user, session: result.data.session, success: true };
  } catch (error) {
    console.error('Error en registro:', error.message);
    return { error: error.message, success: false };
  }
};

export const signIn = async (email, password) => {
  try {
    const result = await withRetry(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data };
    });
    
    return { user: result.data.user, session: result.data.session, success: true };
  } catch (error) {
    console.error('Error en inicio de sesión:', error.message);
    return { error: error.message, success: false };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error cerrando sesión:', error.message);
    return { error: error.message, success: false };
  }
};

export const resetPassword = async (email) => {
  try {
    const result = await withRetry(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      return { success: true };
    });
    
    return result;
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error.message);
    return { error: error.message, success: false };
  }
};

export const updatePassword = async (newPassword) => {
  try {
    const result = await withRetry(async () => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return { success: true };
    });
    
    return result;
  } catch (error) {
    console.error('Error al actualizar contraseña:', error.message);
    return { error: error.message, success: false };
  }
};

export const getCurrentUser = async () => {
  try {
    const result = await withRetry(async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      return { user };
    });
    
    return { user: result.user, success: true };
  } catch (error) {
    console.error('Error al obtener usuario actual:', error.message);
    return { user: null, success: false };
  }
};

export const fetchData = async (table) => {
  try {
    const result = await withRetry(async () => {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      return { data };
    });
    
    return { data: result.data, success: true };
  } catch (error) {
    console.error(`Error fetching data from ${table}:`, error.message);
    return { error: error.message, success: false };
  }
};

export const insertData = async (table, data) => {
  try {
    const result = await withRetry(async () => {
      const { data: newData, error } = await supabase.from(table).insert(data).select();
      if (error) throw error;
      return { data: newData };
    });
    
    return { data: result.data, success: true };
  } catch (error) {
    console.error(`Error inserting data into ${table}:`, error.message);
    return { error: error.message, success: false };
  }
};

export const updateData = async (table, id, data) => {
  try {
    const result = await withRetry(async () => {
      const { data: updates, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();
      if (error) throw error;
      return { data: updates };
    });
    
    return { data: result.data, success: true };
  } catch (error) {
    console.error(`Error updating data in ${table}:`, error.message);
    return { error: error.message, success: false };
  }
};

export const deleteData = async (table, id) => {
  try {
    const result = await withRetry(async () => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    });
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting data from ${table}:`, error.message);
    return { error: error.message, success: false };
  }
};

export default supabase;
