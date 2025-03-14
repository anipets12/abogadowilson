import { supabase } from '../config/supabase';

// Número máximo de tokens
const MAX_TOKENS = 3;

// Función para manejar reintentos en caso de errores de red
const executeWithRetry = async (fn, maxRetries = 3) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.log(`Intento ${i + 1} fallido en tokenService. Reintentando...`);
      lastError = err;
      // Esperar antes de reintentar (1s, 2s, 4s - backoff exponencial)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw lastError;
};

/**
 * Inicializa los tokens de un usuario si no existen
 * @param {string} userId - ID del usuario
 * @returns {Promise<{tokens: number, error: Error|null}>}
 */
export const initializeUserTokens = async (userId) => {
  try {
    // Verificar si el usuario ya tiene tokens asignados
    const { data: existingTokens, error: fetchError } = await executeWithRetry(() => 
      supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', userId)
        .single()
    );

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error al verificar tokens del usuario:', fetchError);
      return { tokens: 0, error: fetchError };
    }

    // Si el usuario ya tiene tokens, devolver ese valor
    if (existingTokens) {
      return { tokens: existingTokens.tokens_remaining, error: null };
    }

    // Si no tiene tokens, inicializar con el máximo
    const { data: newTokenData, error: insertError } = await executeWithRetry(() =>
      supabase
        .from('user_tokens')
        .insert([
          { 
            user_id: userId, 
            tokens_remaining: MAX_TOKENS,
            last_refill: new Date().toISOString()
          }
        ])
        .select()
        .single()
    );

    if (insertError) {
      console.error('Error al inicializar tokens del usuario:', insertError);
      return { tokens: 0, error: insertError };
    }

    return { tokens: newTokenData.tokens_remaining, error: null };
  } catch (error) {
    console.error('Error inesperado al inicializar tokens:', error);
    return { tokens: 0, error };
  }
};

/**
 * Obtiene los tokens disponibles de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<{tokens: number, error: Error|null}>}
 */
export const getUserTokens = async (userId) => {
  try {
    // Si no hay userId, no hacer nada
    if (!userId) {
      return { tokens: 0, error: new Error('Usuario no autenticado') };
    }

    // Verificar si el usuario ya tiene tokens asignados
    const { data, error } = await executeWithRetry(() =>
      supabase
        .from('user_tokens')
        .select('tokens_remaining')
        .eq('user_id', userId)
        .single()
    );

    if (error) {
      // Si el error es que no se encontró el registro, inicializar tokens
      if (error.code === 'PGRST116') {
        return await initializeUserTokens(userId);
      }
      
      console.error('Error al obtener tokens del usuario:', error);
      return { tokens: 0, error };
    }

    return { tokens: data.tokens_remaining, error: null };
  } catch (error) {
    console.error('Error inesperado al obtener tokens:', error);
    return { tokens: 0, error };
  }
};

/**
 * Usa un token del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<{success: boolean, tokensRemaining: number, error: Error|null}>}
 */
export const useToken = async (userId) => {
  try {
    // Si no hay userId, no hacer nada
    if (!userId) {
      return { 
        success: false, 
        tokensRemaining: 0, 
        error: 'Usuario no autenticado' 
      };
    }

    // Obtener tokens actuales
    const { tokens, error: getError } = await getUserTokens(userId);
    
    if (getError) {
      return { 
        success: false, 
        tokensRemaining: 0, 
        error: getError.message || 'Error al obtener tokens' 
      };
    }

    // Verificar si hay tokens disponibles
    if (tokens <= 0) {
      return { 
        success: false, 
        tokensRemaining: 0, 
        error: 'No hay tokens disponibles' 
      };
    }

    // Actualizar tokens
    const newTokenAmount = tokens - 1;
    const { data, error: updateError } = await executeWithRetry(() =>
      supabase
        .from('user_tokens')
        .update({ tokens_remaining: newTokenAmount })
        .eq('user_id', userId)
        .select()
        .single()
    );

    if (updateError) {
      console.error('Error al actualizar tokens del usuario:', updateError);
      return { 
        success: false, 
        tokensRemaining: tokens, 
        error: updateError.message || 'Error al actualizar tokens' 
      };
    }

    return { 
      success: true, 
      tokensRemaining: data.tokens_remaining, 
      error: null 
    };
  } catch (error) {
    console.error('Error inesperado al usar token:', error);
    return { 
      success: false, 
      tokensRemaining: 0, 
      error: error.message || 'Error inesperado al usar token' 
    };
  }
};

/**
 * Recarga los tokens de un usuario
 * @param {string} userId - ID del usuario
 * @param {number} amount - Cantidad de tokens a añadir (predeterminado MAX_TOKENS)
 * @returns {Promise<{success: boolean, newTotal: number, error: Error|null}>}
 */
export const refillTokens = async (userId, amount = MAX_TOKENS) => {
  try {
    // Si no hay userId, no hacer nada
    if (!userId) {
      return { 
        success: false, 
        newTotal: 0, 
        error: 'Usuario no autenticado' 
      };
    }

    // Primero verificamos los tokens actuales
    const { tokens: currentTokens, error: getError } = await getUserTokens(userId);
    
    if (getError) {
      // Si el usuario no tiene tokens, inicializarlos
      if (getError.code === 'PGRST116') {
        const { tokens, error: initError } = await initializeUserTokens(userId);
        
        if (initError) {
          return { 
            success: false, 
            newTotal: 0, 
            error: initError.message || 'Error al inicializar tokens' 
          };
        }
        
        return { 
          success: true, 
          newTotal: tokens, 
          error: null 
        };
      }
      
      return { 
        success: false, 
        newTotal: 0, 
        error: getError.message || 'Error al obtener tokens actuales' 
      };
    }

    // Actualizar tokens
    const newTokenAmount = currentTokens + amount;
    const { data, error: updateError } = await executeWithRetry(() =>
      supabase
        .from('user_tokens')
        .update({ 
          tokens_remaining: newTokenAmount,
          last_refill: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()
    );

    if (updateError) {
      console.error('Error al recargar tokens del usuario:', updateError);
      return { 
        success: false, 
        newTotal: currentTokens, 
        error: updateError.message || 'Error al recargar tokens' 
      };
    }

    return { 
      success: true, 
      newTotal: data.tokens_remaining, 
      error: null 
    };
  } catch (error) {
    console.error('Error inesperado al recargar tokens:', error);
    return { 
      success: false, 
      newTotal: 0, 
      error: error.message || 'Error inesperado al recargar tokens' 
    };
  }
};

export {
  getUserTokens,
  useToken,
  refillTokens,
  initializeUserTokens
};
