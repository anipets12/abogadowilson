import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaDownload, FaUser, FaCalendarAlt } from 'react-icons/fa';

import Footer from '../components/Footer/Footer';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/supabaseService';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Obtener detalles del pago de location.state
  const paymentDetails = location.state || {};
  const { paymentId, amount, status } = paymentDetails;
  
  // Si no hay detalles de pago, redirigir a la página principal
  useEffect(() => {
    if (!paymentId) {
      navigate('/');
    }
  }, [paymentId, navigate]);
  
  // Actualizar tokens del usuario (si está autenticado)
  useEffect(() => {
    const updateUserTokens = async () => {
      if (user && status === 'completed') {
        try {
          // Obtener perfil actual
          const { data: profile } = await dataService.getById('profiles', user.id);
          
          if (profile) {
            // Calcular tokens a añadir (1 token por cada $5)
            const tokensToAdd = Math.floor(amount / 5);
            const currentTokens = profile.tokens || 0;
            
            // Actualizar tokens
            await dataService.update('profiles', user.id, {
              tokens: currentTokens + tokensToAdd
            });
            
            console.log(`Tokens actualizados: ${currentTokens} + ${tokensToAdd} = ${currentTokens + tokensToAdd}`);
          }
        } catch (error) {
          console.error('Error al actualizar tokens:', error);
        }
      }
    };
    
    updateUserTokens();
  }, [user, status, amount]);
  
  // Formatear fecha actual
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <>
      <Helmet>
        <title>¡Gracias por su compra! - Abg. Wilson Ipiales</title>
        <meta name="description" content="Confirmación de pago - Abg. Wilson Ipiales" />
      </Helmet>
      
      <main className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <FaCheckCircle className="text-green-600 text-4xl" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Gracias por su compra!</h1>
              <p className="text-gray-600">
                Su pago ha sido procesado correctamente.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles de la Transacción</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Pago:</span>
                  <span className="font-medium">{paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span>{currentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    Completado
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto Total:</span>
                  <span className="font-semibold">${parseFloat(amount).toFixed(2)} USD</span>
                </div>
                {user && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tokens Añadidos:</span>
                    <span className="font-semibold">{Math.floor(amount / 5)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => window.print()} 
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaDownload className="mr-2" /> 
                  Descargar Recibo
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaUser className="mr-2" />
                      Ir a mi Dashboard
                    </Link>
                    
                    <Link 
                      to="/agendar-cita" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FaCalendarAlt className="mr-2" />
                      Agendar una Cita
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/auth/register" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaUser className="mr-2" />
                      Crear una Cuenta
                    </Link>
                    
                    <Link 
                      to="/" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Volver al Inicio
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ThankYouPage;
