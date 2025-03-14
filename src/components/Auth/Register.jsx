import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Si el usuario ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validatePassword = (password) => {
    // Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validaciones básicas
      if (!fullName) throw new Error('El nombre completo es obligatorio');
      if (!email) throw new Error('El correo electrónico es obligatorio');
      if (!password) throw new Error('La contraseña es obligatoria');
      if (password !== confirmPassword) throw new Error('Las contraseñas no coinciden');
      if (!validatePassword(password)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
      }
      if (!acceptTerms) throw new Error('Debe aceptar los términos y condiciones');
      
      // Registro de usuario
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (signUpError) throw signUpError;

      // Crear perfil de usuario en la base de datos
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id, 
            full_name: fullName, 
            email: email,
            created_at: new Date().toISOString()
          }
        ]);
      
      if (profileError) throw profileError;

      // Inicializar tokens para el usuario
      const { error: tokenError } = await supabase
        .from('user_tokens')
        .insert([
          { 
            user_id: data.user.id, 
            tokens_remaining: 3,
            last_refill: new Date().toISOString()
          }
        ]);
      
      if (tokenError) throw tokenError;
      
      toast.success('Registro exitoso. Por favor verifique su correo electrónico para confirmar su cuenta.');
      navigate('/login');
    } catch (err) {
      console.error('Error de registro:', err.message);
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialSignUp = async (provider) => {
    try {
      setLoading(true);
      
      if (provider === 'google') {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        
        if (error) throw error;
      } else if (provider === 'facebook') {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'facebook',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        
        if (error) throw error;
      }
    } catch (err) {
      console.error(`Error en registro con ${provider}:`, err.message);
      toast.error(`Error al registrarse con ${provider}: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
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
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
              />
            </div>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
              <div 
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar contraseña"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="accept-terms"
              name="acceptTerms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
              Acepto los{' '}
              <Link to="/terminos" className="text-blue-600 hover:text-blue-500">
                términos y condiciones
              </Link>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Registrando...
                </div>
              ) : (
                'Registrarse'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continuar con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialSignUp('google')}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaGoogle className="text-red-500 mr-2 h-5 w-5" />
              Google
            </button>
            <button
              onClick={() => handleSocialSignUp('facebook')}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaFacebook className="text-blue-600 mr-2 h-5 w-5" />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
