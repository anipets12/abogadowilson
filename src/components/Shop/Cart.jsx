import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaTimes, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Para evitar animación al cargar la página
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }
    
    // Mostrar notificación cuando se añade al carrito
    if (cart.length > 0) {
      toast.success('Artículo añadido al carrito');
      setIsOpen(true);
    }
  }, [cart.length]);
  
  const toggleCart = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="relative z-50">
      <button
        onClick={toggleCart}
        className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
        aria-label="Carrito de compras"
      >
        <FaShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleCart}
            />
            
            {/* Cart panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center">
                  <FaShoppingCart className="mr-2" /> Carrito de Compras
                </h2>
                <button 
                  onClick={toggleCart}
                  className="text-white hover:text-gray-200 focus:outline-none"
                  aria-label="Cerrar carrito"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <svg 
                      className="mx-auto h-16 w-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <p className="mt-4 text-gray-600">Su carrito está vacío</p>
                    <Link
                      to="/servicios"
                      className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
                      onClick={toggleCart}
                    >
                      Ver Servicios Disponibles
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        className="py-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                            <img 
                              src={item.imageUrl || 'https://via.placeholder.com/150?text=Legal'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {item.category}
                            </p>
                            
                            <div className="mt-2 flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="text-gray-500 hover:text-gray-700 p-1"
                                aria-label="Reducir cantidad"
                              >
                                <FaMinus className="w-3 h-3" />
                              </button>
                              <span className="mx-2 text-gray-700">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                                aria-label="Aumentar cantidad"
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <span className="text-sm font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              aria-label="Eliminar del carrito"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${getCartTotal().toFixed(2)}</p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/checkout"
                      onClick={toggleCart}
                      className="w-full px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
                    >
                      Proceder al Pago
                    </Link>
                    
                    <button
                      onClick={clearCart}
                      className="w-full px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
