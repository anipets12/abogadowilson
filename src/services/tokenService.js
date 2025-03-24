import axios from 'axios';

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
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { tokens: 0, error: new Error('No hay sesión activa') };
    }

    // Usar nuestra API para inicializar tokens
    const response = await executeWithRetry(() => 
      axios.post('/api/tokens/initialize', 
        { userId },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
    );

    if (response.data && response.data.success) {
      return { tokens: response.data.data.tokens, error: null };
    } else {
      return { tokens: 0, error: new Error(response.data?.message || 'Error al inicializar tokens') };
    }
  } catch (error) {
    console.error('Error al inicializar tokens:', error);
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
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { tokens: 0, error: new Error('No hay sesión activa') };
    }

    // Usar nuestra API para obtener tokens
    const response = await executeWithRetry(() => 
      axios.get(`/api/tokens/${userId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
    );

    if (response.data && response.data.success) {
      return { tokens: response.data.data.tokens, error: null };
    } else {
      // Si no hay tokens, inicializarlos
      if (response.data?.message?.includes('no encontrado')) {
        return await initializeUserTokens(userId);
      }
      return { tokens: 0, error: new Error(response.data?.message || 'Error al obtener tokens') };
    }
  } catch (error) {
    console.error('Error al obtener tokens:', error);
    
    // Intenta inicializar si es posible que no existan
    try {
      return await initializeUserTokens(userId);
    } catch {
      return { tokens: 0, error };
    }
  }
};

/**
 * Usa un token del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<{success: boolean, tokens: number, error: Error|null}>}
 */
export const useToken = async (userId) => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, tokens: 0, error: new Error('No hay sesión activa') };
    }

    // Usar nuestra API para usar un token
    const response = await executeWithRetry(() => 
      axios.post('/api/tokens/use', 
        { userId },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
    );

    if (response.data && response.data.success) {
      return { 
        success: true, 
        tokens: response.data.data.tokens, 
        error: null 
      };
    } else {
      return { 
        success: false, 
        tokens: 0, 
        error: new Error(response.data?.message || 'Error al usar token') 
      };
    }
  } catch (error) {
    console.error('Error al usar token:', error);
    return { success: false, tokens: 0, error };
  }
};

/**
 * Recarga los tokens del usuario (una vez al día)
 * @param {string} userId - ID del usuario
 * @returns {Promise<{success: boolean, tokens: number, error: Error|null}>}
 */
export const refillTokens = async (userId) => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, tokens: 0, error: new Error('No hay sesión activa') };
    }

    // Usar nuestra API para recargar tokens
    const response = await executeWithRetry(() => 
      axios.post('/api/tokens/refill', 
        { userId },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
    );

    if (response.data && response.data.success) {
      return { 
        success: true, 
        tokens: response.data.data.tokens, 
        error: null 
      };
    } else {
      return { 
        success: false, 
        tokens: response.data.data?.tokens || 0, 
        error: new Error(response.data?.message || 'Error al recargar tokens') 
      };
    }
  } catch (error) {
    console.error('Error al recargar tokens:', error);
    return { success: false, tokens: 0, error };
  }
};
