import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    acceptTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [networkRetry, setNetworkRetry] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar errores al cambiar datos
    if (error) setError('');
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsSubmitting(false);
      return;
    }

    try {
      // Validar datos antes de enviar al servidor
      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      console.log('Intentando registrar usuario:', formData.email);
      
      // Usar la función con reintentos para el registro
      const response = await executeWithRetry(() => 
        axios.post('/api/auth/register', {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      if (!response.data.success) {
        console.error('Error de registro:', response.data.message);
        throw new Error(response.data.message || 'Error al registrar usuario');
      }

      console.log('Registro exitoso:', response.data);
      
      // Guardar token en localStorage si lo devuelve la API
      if (response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
      }
      
      // Mostrar mensaje de éxito
      toast.success('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
      setSuccess(true);
      
      // Limpiar formulario después de registro exitoso
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        acceptTerms: false
      });
      
      // Redirigir al usuario después de 2 segundos
      setTimeout(() => {
        if (response.data.data?.token) {
          navigate('/dashboard'); // Si ya está autenticado
        } else {
          navigate('/login'); // Si necesita iniciar sesión
        }
      }, 2000);
    } catch (error) {
      console.error('Error al registrar:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage;
      
      if (error.response) {
        // El servidor respondió con un código de error
        errorMessage = error.response.data.message || 'Error en el servidor. Por favor, intenta más tarde.';
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.';
      } else {
        // Error en la configuración de la solicitud
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setNetworkRetry(false);
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-800 md:w-48 flex flex-col justify-center items-center p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Únete a nosotros</h3>
              <p className="text-center">Tu portal para soluciones legales personalizadas</p>
            </div>
            <div className="p-8 md:p-12 w-full">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear una cuenta</h2>
                <p className="text-gray-600">Completa el formulario para comenzar</p>
              </div>
              
              {success ? (
                <div className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Registro exitoso!</h3>
                  <p className="text-gray-600 mb-6">Tu cuenta ha sido creada. Redirigiendo...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Juan"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Pérez"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="juan.perez@ejemplo.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="********"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="********"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono (opcional)</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección (opcional)</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Calle 123 # 45-67"
                    />
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="acceptTerms"
                        name="acceptTerms"
                        type="checkbox"
                        required
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                        Acepto los <a href="/terminos-condiciones" className="text-blue-600 hover:text-blue-500">Términos y Condiciones</a> y la <a href="/privacidad" className="text-blue-600 hover:text-blue-500">Política de Privacidad</a>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {networkRetry ? 'Reintentando...' : 'Procesando...'}
                        </>
                      ) : 'Crear cuenta'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}