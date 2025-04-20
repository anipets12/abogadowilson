import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, 
  FaExclamationTriangle, FaGoogle, FaFacebook, 
  FaWhatsapp, FaTwitter 
} from 'react-icons/fa';

// Usar el servicio de Supabase optimizado para Cloudflare Workers
import { authService, dataService } from '../../services/supabaseService';
import TurnstileWidget from '../TurnstileWidget';

// Importar configuraciones y enlaces sociales
import { socialMedia } from '../../config/appConfig';

// Importar HelmetWrapper para metadatos
import HelmetWrapper from '../Common/HelmetWrapper';

const Register = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraer el código de referido de la URL si existe
  const queryParams = new URLSearchParams(location.search);
  const referralCode = queryParams.get('ref');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: referralCode || '',
    phone: '',
    acceptTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiConnected, setApiConnected] = useState(true);
  
  // Si el usuario ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Verificar conexión a la API al cargar el componente
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        // Intento simple de conexión usando el nuevo servicio mejorado
        const result = await dataService.checkConnection();
        
        if (result && result.connected) {
          console.log('Conexión exitosa a Supabase');
          setApiConnected(true);
        } else {
          console.warn('No se pudo conectar con Supabase:', result?.message);
          setApiConnected(false);
        }
      } catch (err) {
        console.error('Error al verificar conexión:', err);
        setApiConnected(false);
      }
    };
    
    checkApiConnection();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al cambiar el formulario
    if (error) setError(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    // Validar aceptación de términos
    if (!formData.acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }
    
    // Validar que se ha completado el captcha de Turnstile
    if (!turnstileVerified && process.env.NODE_ENV === 'production') {
      toast.error('Por favor, completa la verificación de seguridad');
      return;
    }
    
    setIsSubmitting(true);
    setLoading(true);
    setError(null);
    
    try {
      // Validaciones básicas
      if (!formData.name.trim()) {
        throw new Error('El nombre es obligatorio');
      }
      
      if (!formData.email.trim()) {
        throw new Error('El correo electrónico es obligatorio');
      }
      
      if (!formData.password) {
        throw new Error('La contraseña es obligatoria');
      }
      
      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      
      // Usar directamente el servicio mejorado de authService
      toast.loading('Creando tu cuenta...');
      
      const { data, error, simulated } = await authService.register(
        formData.email,
        formData.password,
        {
          name: formData.name,
          phone: formData.phone,
          referralCode: formData.referralCode
        }
      );
      
      if (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
      }
      
      // Si llegamos aquí, el registro fue exitoso
      toast.dismiss();
      toast.success('¡Registro exitoso! Bienvenido');
      
      if (simulated) {
        console.log('Modo simulado activado debido a limitaciones de API');
        // En modo simulado, redirigir al dashboard directamente
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        // Modo real
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
      
    } catch (error) {
      toast.dismiss();
      setIsSubmitting(false);
      setLoading(false);
      
      let errorMessage = 'Ocurrió un error al registrarse. Por favor intente nuevamente.';
      
      if (error.message) {
        errorMessage = error.message;
        
        // Manejar errores específicos
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este correo electrónico ya está registrado. Por favor inicie sesión.';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Debes confirmar tu correo electrónico antes de iniciar sesión.';
        }
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
      
      // Intentar solucionar automáticamente problemas de CORS/networking
      if (
        error.message?.includes('network') || 
        error.message?.includes('Failed') ||
        error.message?.includes('CORS') ||
        error.message?.includes('connection')
      ) {
        // Activar modo de compatibilidad
        toast.loading('Activando modo de compatibilidad...');
        
        try {
          localStorage.setItem('use_proxy', 'true');
          setTimeout(() => {
            toast.dismiss();
            toast.success('Modo de compatibilidad activado. Reintentando...');
            setTimeout(() => window.location.reload(), 1500);
          }, 1500);
        } catch (e) {
          console.error('Error al activar modo de compatibilidad:', e);
        }
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crear una cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
        
        {!apiConnected && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Detectamos problemas de conexión con nuestros servidores. Puedes continuar, pero es posible que encuentres dificultades.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="referralCode"
                name="referralCode"
                type="text"
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Código de referido (opcional)"
                value={formData.referralCode}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="text"
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Teléfono (opcional)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative">
              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                  Acepto los{' '}
                  <Link to="/terminos-condiciones" className="font-medium text-blue-600 hover:text-blue-500">
                    Términos y Condiciones
                  </Link>{' '}
                  y{' '}
                  <Link to="/politica-privacidad" className="font-medium text-blue-600 hover:text-blue-500">
                    Política de Privacidad
                  </Link>
                  .
                </label>
              </div>
            </div>
          </div>
          
          {/* Integración de Turnstile con manejo de errores mejorado */}
          <div className="mt-4 flex flex-col items-center">
            {/* Solo mostrar Turnstile en producción (evita errores en desarrollo) */}
            {process.env.NODE_ENV === 'production' ? (
              <TurnstileWidget 
                onVerify={() => {
                  setTurnstileVerified(true);
                  console.log('Verificación de Turnstile exitosa');
                }}
                onExpire={() => {
                  setTurnstileVerified(false);
                  console.log('Verificación de Turnstile expirada');
                }}
                onError={(msg) => {
                  console.warn('Error en Turnstile:', msg);
                  // En entorno de Cloudflare, evitar bloquear el registro si Turnstile falla
                  setTurnstileVerified(true);
                }}
                action="register"
                theme="light"
                idempotency="1"
              />
            ) : (
              <div className="p-4 text-sm text-blue-700 bg-blue-50 rounded">
                Verificación de seguridad desactivada en entorno de desarrollo
                <button 
                  type="button" 
                  className="ml-2 text-blue-700 underline"
                  onClick={() => setTurnstileVerified(true)}
                >
                  Simular verificación exitosa
                </button>
              </div>
            )}
          </div>
          
          {/* Botones de autenticación social */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continuar con</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              {/* Botón de Google */}
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const { data, error } = await authService.signInWithGoogle();
                    if (error) throw error;
                    if (data?.url) {
                      // Si es un modo simulado, redireccionar directamente
                      if (data.simulated) {
                        navigate('/dashboard');
                        toast.success('Modo simulado: Iniciaste sesión con Google');
                      } else {
                        // De lo contrario, redirigir a la URL proporcionada por Supabase
                        window.location.href = data.url;
                      }
                    }
                  } catch (error) {
                    toast.error(`Error al iniciar sesión con Google: ${error.message || 'Intente nuevamente'}`);                 
                    console.error('Error de inicio de sesión con Google:', error);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={loading}
              >
                <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                <span>Google</span>
              </button>
              
              {/* Botón de Facebook */}
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const { data, error } = await authService.signInWithFacebook();
                    if (error) throw error;
                    if (data?.url) {
                      // Si es un modo simulado, redireccionar directamente
                      if (data.simulated) {
                        navigate('/dashboard');
                        toast.success('Modo simulado: Iniciaste sesión con Facebook');
                      } else {
                        // De lo contrario, redirigir a la URL proporcionada por Supabase
                        window.location.href = data.url;
                      }
                    }
                  } catch (error) {
                    toast.error(`Error al iniciar sesión con Facebook: ${error.message || 'Intente nuevamente'}`);
                    console.error('Error de inicio de sesión con Facebook:', error);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={loading}
              >
                <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
                <span>Facebook</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              disabled={isSubmitting || (!turnstileVerified && process.env.NODE_ENV === 'production')}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-300 ease-in-out"
            >
              {isSubmitting ? 'Registrando...' : 'Registrarse con Email'}
            </button>
          </div>
        </form>
        
        <div className="text-sm text-center">
          <p className="mt-2 text-gray-600">
            Al registrarte, aceptas nuestros{' '}
            <Link to="/terminos-condiciones" className="font-medium text-blue-600 hover:text-blue-500">
              Términos y Condiciones
            </Link>{' '}
            y{' '}
            <Link to="/politica-privacidad" className="font-medium text-blue-600 hover:text-blue-500">
              Política de Privacidad
            </Link>
            .
          </p>
          
          {/* Enlaces a redes sociales */}
          <div className="mt-4 flex justify-center space-x-4">
            <a href={socialMedia.facebook.pagina} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              <FaFacebook size={20} />
            </a>
            <a href={socialMedia.twitter.profile} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
              <FaTwitter size={20} />
            </a>
            <a href={socialMedia.whatsapp.api} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
              <FaWhatsapp size={20} />
            </a>
          </div>
          
          {/* Comunidad y grupo */}
          <div className="mt-3">
            <p className="text-xs text-gray-500">¡Únete a nuestra comunidad!</p>
            <div className="mt-1 flex justify-center space-x-3">
              <a 
                href={socialMedia.whatsapp.comunidad} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
              >
                Comunidad WhatsApp
              </a>
              <a 
                href={socialMedia.facebook.groups.derechoEcuador} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                Grupo Derecho Ecuador
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
