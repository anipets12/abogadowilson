import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/supabaseService';
import { toast } from 'react-hot-toast';
import coursesService from '../services/coursesService';
import { useNavigate } from 'react-router-dom';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  // Verificar el estado de autenticación al cargar
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { session, error } = await authService.getSession();
        if (session) {
          setUser(session.user);
          
          // Cargar cursos del usuario
          if (session.user.id) {
            fetchUserCourses(session.user.id);
            fetchUserPurchases(session.user.id);
          }
        } else if (error) {
          console.error('Error al verificar sesión:', error);
        }
      } catch (error) {
        console.error('Error al comprobar sesión:', error);
      } finally {
        setAuthReady(true);
        setLoading(false);
      }
    };

    checkSession();
  }, []);
  
  // Cargar cursos del usuario
  const fetchUserCourses = async (userId) => {
    try {
      const { courses, error } = await coursesService.getUserCourses(userId);
      if (error) throw error;
      setUserCourses(courses || []);
    } catch (error) {
      console.error('Error al cargar cursos del usuario:', error);
      toast.error('No pudimos cargar tus cursos. Intenta de nuevo más tarde.', {
        id: 'courses-error'
      });
    }
  };
  
  // Cargar historial de compras del usuario
  const fetchUserPurchases = async (userId) => {
    try {
      const { purchases, error } = await coursesService.getUserPurchases(userId);
      if (error) throw error;
      setUserPurchases(purchases || []);
    } catch (error) {
      console.error('Error al cargar historial de compras:', error);
    }
  };

  // Iniciar sesión
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user: authUser, error } = await authService.login(email, password);
      if (error) throw error;
      
      setUser(authUser);
      
      // Cargar cursos y compras del usuario
      fetchUserCourses(authUser.id);
      fetchUserPurchases(authUser.id);
      
      toast.success('¡Inicio de sesión exitoso!');
      return { user: authUser, error: null };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error(error.message || 'Error al iniciar sesión');
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Registrar usuario
  const register = async (email, password, userData) => {
    setLoading(true);
    try {
      const { user: authUser, error } = await authService.register(email, password, userData);
      if (error) throw error;
      
      setUser(authUser);
      toast.success('¡Registro exitoso!');
      return { user: authUser, error: null };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      toast.error(error.message || 'Error al registrar usuario');
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión con Google
  const loginWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
      return { error: null };
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      toast.error(error.message || 'Error al iniciar sesión con Google');
      return { error };
    }
  };

  // Iniciar sesión con Facebook
  const loginWithFacebook = async () => {
    try {
      await authService.signInWithFacebook();
      return { error: null };
    } catch (error) {
      console.error('Error al iniciar sesión con Facebook:', error);
      toast.error(error.message || 'Error al iniciar sesión con Facebook');
      return { error };
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setUserCourses([]);
      setUserPurchases([]);
      navigate('/');
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  // Recuperar contraseña
  const resetPassword = async (email) => {
    try {
      const { data, error } = await authService.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Revisa tu correo para restablecer tu contraseña');
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);
      toast.error(error.message || 'Error al solicitar recuperación de contraseña');
      return { success: false, error };
    }
  };
  
  // Actualizar perfil del usuario
  const updateProfile = async (userId, userData) => {
    try {
      const { data, error } = await authService.updateUser(userData);
      if (error) throw error;
      
      // Actualizar usuario en el estado
      setUser(current => ({
        ...current,
        ...userData
      }));
      
      toast.success('Perfil actualizado correctamente');
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error(error.message || 'Error al actualizar perfil');
      return { success: false, error };
    }
  };
  
  // Comprobar si el usuario tiene un curso específico
  const hasUserPurchasedCourse = (courseId) => {
    return userCourses.some(course => course.course_id === courseId);
  };
  
  // Marcar una lección como completada
  const markLessonAsCompleted = async (courseId, lessonId) => {
    if (!user) return { success: false, error: { message: 'Usuario no autenticado' } };
    
    try {
      const { success, error } = await coursesService.markLessonAsCompleted(
        user.id,
        courseId,
        lessonId
      );
      
      if (error) throw error;
      
      // Actualizar la lista de cursos del usuario
      fetchUserCourses(user.id);
      
      return { success, error: null };
    } catch (error) {
      console.error('Error al marcar lección como completada:', error);
      return { success: false, error };
    }
  };
  
  // Verificar si el usuario es administrador
  const isAdmin = user && user.email && (
    user.email === 'alexip2@hotmail.com' || 
    user.email === 'Wifirmalegal@gmail.com'
  );

  // Valores del contexto
  const value = {
    user,
    userCourses,
    userPurchases,
    loading,
    authReady,
    isAdmin,
    login,
    register,
    logout,
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
    updateProfile,
    hasUserPurchasedCourse,
    markLessonAsCompleted,
    refreshUserCourses: () => user && fetchUserCourses(user.id),
    refreshUserPurchases: () => user && fetchUserPurchases(user.id)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
