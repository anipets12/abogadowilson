import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { toast } from 'react-hot-toast';
import { FaLock, FaArrowLeft } from 'react-icons/fa';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [networkRetry, setNetworkRetry] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const navigate = useNavigate();

  // Verificar al cargar si tenemos hash en la URL (token de reseteo)
  useEffect(() => {
    // El token debería estar en el hash de la URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    
    if (!accessToken) {
      setTokenError(true);
      setError('No se encontró un token válido para cambiar la contraseña. Por favor solicite un nuevo enlace de recuperación.');
      toast.error('Enlace de recuperación inválido o expirado');
    }
  }, []);

  // Función para manejar reintentos en caso de errores de red
  const executeWithRetry = async (fn, maxRetries = 5) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        setNetworkRetry(i > 0);
        return await fn();
      } catch (err) {
        console.log(`Intento ${i + 1} fallido. Reintentando...`);
        lastError = err;
        // Esperar antes de reintentar (1s, 2s, 4s - backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    setNetworkRetry(false);
    throw lastError;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Cambiando contraseña');
      
      const { error: updateError } = await executeWithRetry(() => 
        supabase.auth.updateUser({
          password: password
        })
      );
      
      if (updateError) {
        console.error('Error al cambiar contraseña:', updateError);
        throw updateError;
      }
      
      const successMessage = 'Tu contraseña ha sido cambiada exitosamente.';
      setMessage(successMessage);
      toast.success(successMessage);
      console.log('Contraseña cambiada exitosamente');
      
      // Redirigir después de un tiempo
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error completo:', err);
      
      let errorMessage;
      if (err.message && (err.message.includes('fetch') || err.message.includes('network') || err.name === 'TypeError')) {
        errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.';
      } else if (err.message && err.message.includes('password')) {
        errorMessage = 'La contraseña no cumple con los requisitos mínimos de seguridad.';
      } else if (err.message && err.message.includes('token')) {
        errorMessage = 'El enlace ha expirado o es inválido. Por favor solicite uno nuevo.';
      } else {
        errorMessage = err.message || 'Error al cambiar la contraseña';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setNetworkRetry(false);
    }
  };

  if (tokenError) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg">
          <div className="md:flex">
            <div className="p-8 w-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Error de Recuperación</h2>
                <p className="text-gray-600">No se encontró un token válido para cambiar la contraseña</p>
              </div>
              
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
                <p>{error}</p>
              </div>
              
              <div className="text-center">
                <button 
                  onClick={() => navigate('/recuperar-contrasena')}
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaArrowLeft className="mr-2" /> Solicitar nuevo enlace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Cambiar Contraseña</h2>
              <p className="text-gray-600">Ingresa tu nueva contraseña</p>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {message && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                <p>{message}</p>
              </div>
            )}
            
            {networkRetry && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                <p>Intentando conectar al servidor... Por favor espere.</p>
              </div>
            )}
            
            {!message ? (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Repite tu contraseña"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cambiando...
                      </span>
                    ) : 'Cambiar Contraseña'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <p className="mb-4 text-gray-600">Serás redirigido a la página de inicio de sesión en unos segundos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
