import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/supabaseService';

/**
 * Componente para manejar el callback de autenticación OAuth
 * Procesa las redirecciones de proveedores sociales (Google, Facebook)
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Procesar la respuesta de autenticación
        const { session, error } = await authService.handleAuthCallback();
        
        if (error) throw error;
        
        if (session) {
          // Obtener datos del usuario autenticado
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
            role: session.user.user_metadata?.role || 'user',
            provider: session.user.app_metadata?.provider || 'email',
          };
          
          // Guardar sesión en localStorage
          localStorage.setItem('authToken', session.access_token);
          localStorage.setItem('refreshToken', session.refresh_token);
          
          // Actualizar contexto de autenticación
          setUser(userData);
          
          toast.success('Inicio de sesión exitoso');
          navigate('/dashboard');
        } else {
          throw new Error('No se recibió información de sesión');
        }
      } catch (err) {
        console.error('Error al procesar callback de autenticación:', err);
        setError(err.message || 'Error al procesar la autenticación');
        toast.error('Error al procesar la autenticación');
        
        // Redirigir a la página de inicio de sesión después de un breve retraso
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Procesando Autenticación
        </h2>
        
        {loading ? (
          <div className="text-center">
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">
              Completando tu inicio de sesión...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Serás redirigido automáticamente.
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-red-600 font-medium">
              {error}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Redirigiendo a la página de inicio de sesión...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-green-600 font-medium">
              ¡Autenticación exitosa!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Redirigiendo a tu panel...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
