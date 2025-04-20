import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCoins, FaArrowRight, FaCreditCard, FaShieldAlt, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import Footer from '../components/Footer/Footer';
import PayPalButton from '../components/Payment/PayPalButton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const TokensPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  // Datos de los paquetes de tokens
  const tokenPackages = [
    {
      id: 'token-basic',
      name: 'Paquete Básico',
      tokens: 5,
      price: 25.00,
      features: [
        'Consultas básicas',
        'Acceso a recursos legales',
        'Validez de 30 días'
      ],
      popular: false,
      type: 'tokens'
    },
    {
      id: 'token-standard',
      name: 'Paquete Estándar',
      tokens: 10,
      price: 45.00,
      features: [
        'Consultas detalladas',
        'Acceso a recursos premium',
        'Chat prioritario',
        'Validez de 60 días'
      ],
      popular: true,
      type: 'tokens'
    },
    {
      id: 'token-premium',
      name: 'Paquete Premium',
      tokens: 20,
      price: 80.00,
      features: [
        'Consultas ilimitadas',
        'Acceso total a recursos',
        'Soporte prioritario',
        'Descuentos en servicios adicionales',
        'Validez de 90 días'
      ],
      popular: false,
      type: 'tokens'
    }
  ];
  
  // Manejar la selección de un paquete
  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    
    // Desplazar a la sección de pago
    setTimeout(() => {
      document.getElementById('payment-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };
  
  // Agregar al carrito
  const handleAddToCart = (pkg) => {
    if (!user) {
      toast.error('Debe iniciar sesión para comprar tokens');
      // Redirigir a la página de login
      navigate('/auth/login', { 
        state: { 
          from: '/tokens',
          message: 'Inicie sesión para comprar tokens' 
        } 
      });
      return;
    }
    
    addToCart({
      id: pkg.id,
      title: pkg.name,
      price: pkg.price,
      quantity: 1,
      type: 'tokens',
      details: {
        token_count: pkg.tokens
      }
    });
    
    toast.success(`${pkg.name} añadido al carrito`);
    setTimeout(() => {
      navigate('/checkout');
    }, 1500);
  };
  
  // Si no hay un paquete seleccionado, mostrar todos los paquetes
  if (!selectedPackage) {
    return (
      <>
        <Helmet>
          <title>Tokens - Adquiera Tokens para Servicios Legales | Abg. Wilson Ipiales</title>
          <meta name="description" content="Adquiera tokens para acceder a servicios legales premium" />
        </Helmet>
        
        <main className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                Tokens para Servicios Legales
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                Los tokens le permiten acceder a consultas legales, revisión de documentos y asesoría personalizada a través de nuestra plataforma.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {tokenPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`bg-white rounded-lg shadow-md overflow-hidden border ${pkg.popular ? 'border-blue-500' : 'border-gray-200'} relative`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Popular
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="flex items-baseline mb-6">
                      <span className="text-3xl font-bold text-gray-900">${pkg.price.toFixed(2)}</span>
                      <span className="text-gray-500 ml-2">USD</span>
                    </div>
                    
                    <div className="flex items-center mb-6 bg-blue-50 p-3 rounded-lg">
                      <FaCoins className="text-blue-500 mr-2" />
                      <span className="text-blue-700 font-medium">{pkg.tokens} tokens</span>
                    </div>
                    
                    <ul className="mb-6 space-y-3">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleSelectPackage(pkg)}
                      className={`w-full py-2 px-4 rounded-md font-medium flex items-center justify-center ${
                        pkg.popular 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      Seleccionar
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¿Qué son los tokens?</h3>
                  <p className="text-gray-600">Los tokens son unidades digitales que le permiten acceder a diversos servicios legales dentro de nuestra plataforma, como consultas personalizadas, revisión de documentos y asesoría legal.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¿Cuánto tiempo son válidos los tokens?</h3>
                  <p className="text-gray-600">La validez depende del paquete adquirido. Los tokens del Paquete Básico son válidos por 30 días, los del Paquete Estándar por 60 días y los del Paquete Premium por 90 días desde la fecha de compra.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¿Puedo transferir mis tokens a otra persona?</h3>
                  <p className="text-gray-600">No, los tokens son personales e intransferibles, asociados a su cuenta en nuestra plataforma.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
  
  // Si hay un paquete seleccionado, mostrar la página de pago
  return (
    <>
      <Helmet>
        <title>Adquirir {selectedPackage.name} | Abg. Wilson Ipiales</title>
        <meta name="description" content="Adquiera tokens para acceder a servicios legales premium" />
      </Helmet>
      
      <main className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div id="payment-section" className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Adquirir {selectedPackage.name}</h1>
                  <button 
                    onClick={() => setSelectedPackage(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Cambiar paquete
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:space-x-8">
                  <div className="md:w-1/2 mb-6 md:mb-0">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen de compra</h2>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Paquete:</span>
                        <span className="font-medium">{selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tokens:</span>
                        <span className="font-medium">{selectedPackage.tokens}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Precio:</span>
                        <span className="font-medium">${selectedPackage.price.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 my-3"></div>
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-medium">Total:</span>
                        <span className="text-blue-600 font-bold">${selectedPackage.price.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center">
                        <FaShieldAlt className="text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">Pago seguro garantizado</span>
                      </div>
                      <div className="flex items-center">
                        <FaCoins className="text-blue-500 mr-2" />
                        <span className="text-sm text-gray-600">Tokens disponibles inmediatamente después del pago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Métodos de pago</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <button
                          onClick={() => handleAddToCart(selectedPackage)}
                          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <FaCreditCard className="mr-2" />
                          Proceder al pago
                        </button>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          Serás redirigido a nuestra página de checkout
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 text-center mt-4">
                          Al completar la compra, aceptas nuestros <a href="/terminos-condiciones" className="text-blue-600 hover:underline">Términos y Condiciones</a> y <a href="/politica-privacidad" className="text-blue-600 hover:underline">Política de Privacidad</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default TokensPage;
