import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';
import { getUserTokens, initializeUserTokens, useToken, refillTokens } from '../services/tokenService';
import { toast } from 'react-hot-toast';

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
  const executeWithRetry = async (fn, maxRetries = 5) => {
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

  // Cargar el usuario actual desde Supabase
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setConnectionError(false);
        console.log('Verificando sesión de usuario...');
        
        // Intenta obtener la sesión del almacenamiento local primero
        const { data: { user: currentUser }, error: userError } = await executeWithRetry(() => 
          supabase.auth.getUser()
        );

        if (userError) {
          console.error('Error al obtener usuario:', userError);
          throw userError;
        }

        if (currentUser) {
          console.log('Usuario encontrado:', currentUser.email);
          setUser(currentUser);
          // Obtener tokens del usuario
          try {
            const { tokens } = await getUserTokens(currentUser.id);
            setTokens(tokens);
          } catch (tokenError) {
            console.error('Error obteniendo tokens:', tokenError);
            // No bloqueamos la autenticación si hay error en tokens
          }
        } else {
          console.log('No se encontró usuario autenticado');
          setUser(null);
        }
      } catch (error) {
        console.error('Error obteniendo usuario autenticado:', error);
        // Si hay error, asumimos que no hay sesión
        setUser(null);
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    };

    fetchUser();

    // Suscribirse a cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Usuario ha iniciado sesión:', session.user.email);
          setUser(session.user);
          
          // Inicializar o obtener tokens
          try {
            const { tokens } = await getUserTokens(session.user.id);
            setTokens(tokens);
          } catch (error) {
            console.error('Error obteniendo tokens después de login:', error);
          }
          
          toast.success('Sesión iniciada correctamente');
        } else if (event === 'SIGNED_OUT') {
          console.log('Usuario ha cerrado sesión');
          setUser(null);
          setTokens(0);
          toast.success('Sesión cerrada correctamente');
        } else if (event === 'USER_UPDATED' && session?.user) {
          console.log('Datos de usuario actualizados:', session.user.email);
          setUser(session.user);
        } else if (event === 'PASSWORD_RECOVERY') {
          toast.info('Siga las instrucciones para recuperar su contraseña');
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Mostrar mensaje de error de conexión si es necesario
  useEffect(() => {
    if (connectionError) {
      toast.error('Hay problemas de conexión con el servidor. Algunas funciones pueden no estar disponibles.', {
        duration: 5000,
        id: 'connection-error',
      });
    }
  }, [connectionError]);

  // Función para usar un token
  const useUserToken = async () => {
    if (!user) {
      toast.error('Debe iniciar sesión para usar tokens');
      return { success: false };
    }
    
    if (tokens <= 0) {
      toast.error('No tiene tokens disponibles. Por favor recargue.');
      return { success: false };
    }
    
    try {
      const { tokensRemaining, success, error } = await useToken(user.id);
      
      if (error) {
        toast.error(error);
        return { success: false };
      }
      
      setTokens(tokensRemaining);
      return { success, tokensRemaining };
    } catch (error) {
      toast.error('Error al usar el token');
      return { success: false };
    }
  };

  // Función para recargar tokens
  const rechargeTokens = async (amount) => {
    if (!user) {
      toast.error('Debe iniciar sesión para recargar tokens');
      return { success: false };
    }
    
    try {
      const { newTotal, success, error } = await refillTokens(user.id, amount);
      
      if (error) {
        toast.error(error);
        return { success: false };
      }
      
      setTokens(newTotal);
      toast.success(`Se han agregado ${amount} tokens a su cuenta`);
      return { success, newTotal };
    } catch (error) {
      toast.error('Error al recargar tokens');
      return { success: false };
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      console.log('Cerrando sesión...');
      await executeWithRetry(() => supabase.auth.signOut());
      setUser(null);
      setTokens(0);
      toast.success('Sesión cerrada correctamente');
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
      return { success: false, error };
    }
  };

  const value = {
    user,
    tokens,
    loading,
    authReady,
    connectionError,
    useToken: useUserToken,
    rechargeTokens,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
