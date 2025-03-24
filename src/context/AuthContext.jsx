import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserTokens, initializeUserTokens, useToken, refillTokens } from '../services/tokenService';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // Función para manejar reintentos en caso de errores de red
  const executeWithRetry = async (fn, maxRetries = 3) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (err) {
        console.log(`Intento ${i + 1} fallido. Reintentando...`);
        lastError = err;
        // Esperar antes de reintentar (1s, 2s, 4s - backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    
    // Marcar que hay un error de conexión después de agotar los reintentos
    setConnectionError(true);
    throw lastError;
  };

  // Verificar si hay un token almacenado y obtener el usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setConnectionError(false);
        console.log('Verificando sesión de usuario...');
        
        // Obtener token del localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No se encontró token de autenticación');
          setUser(null);
          setLoading(false);
          setAuthReady(true);
          return;
        }
        
        // Validar token con el servidor
        try {
          const response = await executeWithRetry(() => 
            axios.get('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
          );
          
          if (response.data.success && response.data.data.user) {
            const userData = response.data.data.user;
            console.log('Usuario autenticado:', userData.email);
            setUser(userData);
            
            // Obtener tokens del usuario
            try {
              const { tokens } = await getUserTokens(userData.id);
              setTokens(tokens);
            } catch (tokenError) {
              console.error('Error obteniendo tokens:', tokenError);
              // No bloqueamos la autenticación si hay error en tokens
            }
          } else {
            console.log('Token inválido o expirado');
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } catch (error) {
          console.error('Error al validar token:', error);
          // Si el error es por token inválido o expirado, eliminar el token
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('authToken');
          }
          setUser(null);
        }
      } catch (error) {
        console.error('Error obteniendo usuario autenticado:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    };

    fetchUser();
  }, []);

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      // Enviar solicitud de logout al servidor
      const token = localStorage.getItem('authToken');
      
      if (token) {
        await executeWithRetry(() => 
          axios.post('/api/auth/logout', {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        );
      }
      
      // Eliminar token del localStorage
      localStorage.removeItem('authToken');
      setUser(null);
      
      // Redireccionar a la página de inicio
      window.location.href = '/';
      
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún si falla la solicitud al servidor, eliminamos el token local
      localStorage.removeItem('authToken');
      setUser(null);
      window.location.href = '/';
    }
  };

  // Exponer valores del contexto
  const value = {
    user,
    setUser,
    tokens,
    setTokens,
    loading,
    signOut,
    authReady,
    connectionError,
    initializeUserTokens,
    useToken,
    refillTokens
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
