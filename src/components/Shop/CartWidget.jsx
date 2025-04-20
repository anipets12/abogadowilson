import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const CartWidget = () => {
  const { cart, getCartTotal, toggleCartVisibility, isCartVisible } = useCart();
  
  // Calcular el número total de items en el carrito
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <div className="relative">
      {/* Botón del carrito */}
      <button 
        onClick={toggleCartVisibility}
        className="flex items-center text-white focus:outline-none"
        aria-label="Carrito de compras"
      >
        <FaShoppingCart className="text-xl" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
      
      {/* Mini carrito desplegable */}
      <AnimatePresence>
        {isCartVisible && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Mi Carrito</h3>
              <p className="text-sm text-gray-500">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
            
            {cart.length > 0 ? (
              <>
                <div className="max-h-60 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center p-4 hover:bg-gray-50">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaShoppingCart />
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-between mb-4">
                    <span className="text-sm font-medium text-gray-900">Total</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <Link
                    to="/checkout"
                    className="block w-full bg-blue-600 py-2 px-4 rounded-md text-white text-center font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => toggleCartVisibility(false)}
                  >
                    Finalizar Compra
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">Tu carrito está vacío</p>
                <Link
                  to="/servicios"
                  className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => toggleCartVisibility(false)}
                >
                  Ver servicios disponibles
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartWidget;
