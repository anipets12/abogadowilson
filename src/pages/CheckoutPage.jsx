import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaLock, FaCreditCard, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import Footer from '../components/Footer/Footer';
import PayPalButton from '../components/Payment/PayPalButton';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/supabaseService';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    identificacion: '',
    direccion: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  
  // Cargar datos del usuario si está autenticado
  useEffect(() => {
    if (user) {
      // Intentar obtener información del perfil desde Supabase
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await dataService.getById('profiles', user.id);
          
          if (data && !error) {
            setBillingInfo({
              name: data.full_name || '',
              email: user.email || '',
              phone: data.phone || '',
              identificacion: data.identification || '',
              direccion: data.address || ''
            });
          }
        } catch (error) {
          console.error('Error al obtener perfil de usuario:', error);
        }
      };
      
      fetchUserProfile();
    }
  }, [user]);
  
  // Verificar que hay productos en el carrito
  useEffect(() => {
    if (cart.length === 0) {
      toast.error('No hay productos en el carrito');
      navigate('/servicios');
    }
  }, [cart, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    // Validar campos obligatorios
    if (!billingInfo.name.trim()) {
      toast.error('Por favor ingrese su nombre completo');
      return false;
    }
    
    if (!billingInfo.email.trim() || !/^\S+@\S+\.\S+$/.test(billingInfo.email)) {
      toast.error('Por favor ingrese un correo electrónico válido');
      return false;
    }
    
    if (!billingInfo.phone.trim()) {
      toast.error('Por favor ingrese su número telefónico');
      return false;
    }
    
    return true;
  };
  
  const handleBankTransfer = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Generar ID único para la orden
      const orderId = 'ORD-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
      
      // Guardar la orden en Supabase
      await dataService.create('orders', {
        id: orderId,
        user_id: user ? user.id : null,
        amount: getCartTotal(),
        status: 'pending',
        payment_method: 'bank_transfer',
        items: cart,
        billing_info: billingInfo,
        created_at: new Date().toISOString()
      });
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a página de confirmación
      navigate('/transferencia-bancaria', { 
        state: { 
          orderId,
          amount: getCartTotal(),
          billingInfo
        } 
      });
      
    } catch (error) {
      console.error('Error al procesar la orden:', error);
      toast.error('Hubo un problema al procesar su orden. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Finalizar Compra | Abg. Wilson Ipiales</title>
        <meta name="description" content="Finalice su compra de servicios legales con el Abg. Wilson Ipiales" />
      </Helmet>
      
      <Header />
      
      <main className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-gray-900 mb-8"
          >
            Finalizar Compra
          </motion.h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Formulario de Checkout */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600" />
                Información de Facturación
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={billingInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={billingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={billingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="identificacion" className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula o RUC
                  </label>
                  <input
                    type="text"
                    id="identificacion"
                    name="identificacion"
                    value={billingInfo.identificacion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <textarea
                    id="direccion"
                    name="direccion"
                    value={billingInfo.direccion}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FaCreditCard className="mr-2 text-blue-600" />
                  Método de Pago
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="paypal"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                      PayPal (Tarjeta de crédito/débito)
                    </label>
                    <img src="/images/paypal.png" alt="PayPal" className="h-8 ml-auto" />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="bank-transfer"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'bank-transfer'}
                      onChange={() => setPaymentMethod('bank-transfer')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="bank-transfer" className="ml-3 block text-sm font-medium text-gray-700">
                      Transferencia Bancaria
                    </label>
                  </div>
                </div>
                
                {paymentMethod === 'bank-transfer' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-md font-medium text-gray-800 mb-2">Datos Bancarios:</h3>
                    <p className="text-sm text-gray-700">Banco Pichincha</p>
                    <p className="text-sm text-gray-700">Cuenta Corriente: 2203728320</p>
                    <p className="text-sm text-gray-700">Titular: Wilson Alexander Ipiales Guerron</p>
                    <p className="text-sm text-gray-700">CI: 1003385786</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Al seleccionar este método, recibirá instrucciones para completar su pago.
                    </p>
                    
                    <button
                      onClick={handleBankTransfer}
                      disabled={loading}
                      className="mt-4 w-full px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading ? 'Procesando...' : 'Continuar con Transferencia Bancaria'}
                    </button>
                  </div>
                )}
                
                {paymentMethod === 'paypal' && (
                  <PayPalButton amount={getCartTotal().toFixed(2)} />
                )}
              </div>
            </motion.div>
            
            {/* Resumen del Pedido */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaShoppingCart className="mr-2 text-blue-600" />
                Resumen del Pedido
              </h2>
              
              <div className="divide-y divide-gray-200">
                {cart.map(item => (
                  <div key={item.id} className="py-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name} {item.quantity > 1 && `(${item.quantity})`}
                      </p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${getCartTotal().toFixed(2)}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-gray-600">IVA (12%)</p>
                  <p className="text-sm font-medium text-gray-900">${(getCartTotal() * 0.12).toFixed(2)}</p>
                </div>
                <div className="flex justify-between mt-4 text-lg font-bold">
                  <p>Total</p>
                  <p>${(getCartTotal() * 1.12).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center text-sm text-gray-600">
                <FaLock className="text-green-500 mr-2" />
                <p>Pago seguro garantizado</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CheckoutPage;
