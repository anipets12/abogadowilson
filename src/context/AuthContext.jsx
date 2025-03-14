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
    throw lastError;
  };

  // Cargar el usuario actual desde Supabase
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Intenta obtener la sesión del almacenamiento local primero
        const { data: { user: currentUser } } = await executeWithRetry(() => 
          supabase.auth.getUser()
        );

        if (currentUser) {
          setUser(currentUser);
          // Obtener tokens del usuario
          try {
            const { tokens } = await getUserTokens(currentUser.id);
            setTokens(tokens);
          } catch (tokenError) {
            console.error('Error obteniendo tokens:', tokenError);
            // No bloqueamos la autenticación si hay error en tokens
          }
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
          setUser(null);
          setTokens(0);
          toast.success('Sesión cerrada correctamente');
        } else if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

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
      await executeWithRetry(() => supabase.auth.signOut());
      setUser(null);
      setTokens(0);
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
