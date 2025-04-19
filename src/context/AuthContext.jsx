import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/apiService';
import { toast } from 'react-hot-toast';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenExpiry, setTokenExpiry] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay un token en localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setLoading(false);
          setAuthReady(true);
          return;
        }
        
        // Verificar si el token es válido obteniendo datos del usuario
        const { data, error } = await authService.getUser();
        
        if (error) {
          console.error('Error al verificar autenticación:', error);
          // Si hay error, probablemente el token no es válido
          localStorage.removeItem('authToken');
          setUser(null);
          setIsAdmin(false);
          setIsPremium(false);
          setTokenBalance(0);
        } else if (data && data.user) {
          console.log('Usuario autenticado:', data.user);
          setUser(data.user);
          
          // Establecer roles y estado
          setIsAdmin(data.user.role === 'admin');
          setIsPremium(data.user.isPremium || false);
          
          // Obtener saldo de tokens si el usuario está autenticado
          fetchTokenBalance();
        }
      } catch (err) {
        console.error('Error al verificar autenticación:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await authService.login(email, password);
      
      if (error) {
        throw new Error(error.message || 'Error al iniciar sesión');
      }
      
      setUser(data.user);
      
      // Establecer roles y estado
      setIsAdmin(data.user.role === 'admin');
      setIsPremium(data.user.isPremium || false);
      
      // Obtener saldo de tokens
      fetchTokenBalance();
      
      toast.success('Sesión iniciada correctamente');
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    setLoading(true);
    try {
      const { data, error } = await authService.register(userData);
      
      if (error) {
        throw new Error(error.message || 'Error al registrar usuario');
      }
      
      if (data.user) {
        setUser(data.user);
        
        // Establecer roles y estado
        setIsAdmin(data.user.role === 'admin');
        setIsPremium(data.user.isPremium || false);
        
        // Obtener saldo de tokens iniciales (generalmente 0 para nuevos usuarios)
        fetchTokenBalance();
        
        toast.success('Registro exitoso. ¡Bienvenido!');
      }
      
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await authService.signOut();
      
      if (error) {
        throw new Error(error.message || 'Error al cerrar sesión');
      }
      
      setUser(null);
      setIsAdmin(false);
      setIsPremium(false);
      setTokenBalance(0);
      setTokenExpiry(null);
      
      toast.success('Sesión cerrada correctamente');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Obtener el saldo de tokens del usuario
  const fetchTokenBalance = async () => {
    try {
      const { data, error } = await authService.getTokenBalance();
      
      if (error) {
        console.error('Error al obtener saldo de tokens:', error);
        return;
      }
      
      if (data) {
        setTokenBalance(data.balance || 0);
        setTokenExpiry(data.expiry || null);
      }
    } catch (err) {
      console.error('Error al obtener saldo de tokens:', err);
    }
  };
  
  // Función para actualizar el usuario actual
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    
    // Actualizar roles si han cambiado
    if (userData.role) {
      setIsAdmin(userData.role === 'admin');
    }
    
    if (userData.isPremium !== undefined) {
      setIsPremium(userData.isPremium);
    }
  };
  
  // Función para actualizar el saldo de tokens
  const updateTokenBalance = (newBalance, newExpiry = null) => {
    setTokenBalance(newBalance);
    if (newExpiry) {
      setTokenExpiry(newExpiry);
    }
  };
  
  // Verificar si el usuario tiene tokens suficientes
  const hasEnoughTokens = (requiredAmount) => {
    return tokenBalance >= requiredAmount;
  };
  
  // Consumir tokens para una acción
  const consumeTokens = async (amount, actionType) => {
    try {
      const { data, error } = await authService.useTokens(amount, actionType);
      
      if (error) {
        throw new Error(error.message || 'Error al utilizar tokens');
      }
      
      if (data) {
        setTokenBalance(data.newBalance);
        return { success: true, newBalance: data.newBalance };
      }
    } catch (err) {
      console.error(`Error al consumir ${amount} tokens:`, err);
      return { success: false, error: err.message };
    }
  };
  
  // Función para solicitar contraseña olvidada
  const requestPasswordReset = async (email) => {
    setLoading(true);
    try {
      const { data, error } = await authService.requestPasswordReset(email);
      
      if (error) {
        throw new Error(error.message || 'Error al solicitar restablecimiento de contraseña');
      }
      
      toast.success('Se ha enviado un correo con instrucciones para restablecer tu contraseña');
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Función para restablecer contraseña con token
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    try {
      const { data, error } = await authService.resetPassword(token, newPassword);
      
      if (error) {
        throw new Error(error.message || 'Error al restablecer contraseña');
      }
      
      toast.success('Contraseña restablecida correctamente. Ya puedes iniciar sesión.');
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Valores a proporcionar en el contexto
  const value = {
    user,
    setUser,
    loading,
    error,
    authReady,
    isAdmin,
    isPremium,
    tokenBalance,
    tokenExpiry,
    login,
    register,
    logout,
    updateUser,
    updateTokenBalance,
    hasEnoughTokens,
    consumeTokens,
    requestPasswordReset,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
