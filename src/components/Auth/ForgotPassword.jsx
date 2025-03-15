import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [networkRetry, setNetworkRetry] = useState(false);

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
    
    try {
      console.log('Enviando solicitud de recuperación de contraseña para:', email);
      
      const { error: resetError } = await executeWithRetry(() => 
        supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/cambiar-contrasena`,
        })
      );
      
      if (resetError) {
        console.error('Error al solicitar cambio de contraseña:', resetError);
        throw resetError;
      }
      
      const successMessage = 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.';
      setMessage(successMessage);
      toast.success(successMessage);
      console.log('Correo de recuperación enviado exitosamente');
    } catch (err) {
      console.error('Error completo:', err);
      
      let errorMessage;
      if (err.message && (err.message.includes('fetch') || err.message.includes('network') || err.name === 'TypeError')) {
        errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.';
      } else if (err.message && err.message.includes('email')) {
        errorMessage = 'El correo electrónico ingresado no es válido o no existe en nuestros registros.';
      } else {
        errorMessage = err.message || 'Error al solicitar cambio de contraseña';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setNetworkRetry(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Recuperar Contraseña</h2>
              <p className="text-gray-600">Ingresa tu correo electrónico para recibir instrucciones</p>
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="correo@ejemplo.com"
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
                        Enviando...
                      </span>
                    ) : 'Enviar instrucciones'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <p className="mb-4 text-gray-600">Revisa tu bandeja de entrada y sigue las instrucciones enviadas.</p>
                <Link 
                  to="/login"
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaArrowLeft className="mr-2" /> Volver al inicio de sesión
                </Link>
              </div>
            )}
            
            {!message && (
              <div className="mt-6 flex items-center justify-center">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 inline-flex items-center">
                  <FaArrowLeft className="mr-2" /> Volver al inicio de sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
