import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../services/supabase';
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

  // Actualizar usuario actual desde Supabase
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Obtener tokens del usuario
          const { tokens } = await getUserTokens(user.id);
          setTokens(tokens);
        }
      } catch (error) {
        console.error('Error fetching auth user:', error);
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    };

    fetchUser();

    // Suscribirse a cambios de auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          
          // Inicializar o obtener tokens
          const { tokens } = await getUserTokens(session.user.id);
          setTokens(tokens);
          
          toast.success('Sesión iniciada correctamente');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setTokens(0);
          toast.success('Sesión cerrada correctamente');
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
  const refillUserTokens = async () => {
    if (!user) {
      toast.error('Debe iniciar sesión para recargar tokens');
      return { success: false };
    }
    
    try {
      const { tokensRemaining, success, error } = await refillTokens(user.id);
      
      if (error) {
        toast.error(error);
        return { success: false };
      }
      
      setTokens(tokensRemaining);
      toast.success(`Tokens recargados: ${tokensRemaining}`);
      return { success, tokensRemaining };
    } catch (error) {
      toast.error('Error al recargar tokens');
      return { success: false };
    }
  };

  const value = {
    user,
    tokens,
    loading,
    authReady,
    useToken: useUserToken,
    refillTokens: refillUserTokens
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
