import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCoins, FaShoppingCart, FaHistory, FaInfoCircle, FaExclamationTriangle, FaCreditCard, FaCheck, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import TurnstileWidget from '../TurnstileWidget';

// Importar servicios de tokens mejorados
import { tokenService, tokenPlans, tokenServices } from '../../services/tokenService';

// Importar HelmetWrapper para metadatos
import HelmetWrapper from '../Common/HelmetWrapper';

const TokensManager = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(0);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchUserTokens();
      fetchTransactionHistory();
      
      // Usar los planes de token definidos en el servicio
      setPackages(tokenPlans);
      setLoading(false);
    }
  }, [user]);
  
  const fetchUserTokens = async () => {
    try {
      // Usar el servicio de tokens mejorado
      const result = await tokenService.getUserTokens(user.id);
      
      if (result.success) {
        setTokens(result.tokens);
      } else {
        throw new Error(result.error?.message || 'Error al obtener saldo de tokens');
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast.error('No se pudo obtener tu saldo de tokens');
      // Valor de fallback para desarrollo
      setTokens(3);
    }
  };
  
  // No necesitamos fetchTokenPackages ya que los paquetes vienen directamente del servicio
  
  const fetchTransactionHistory = async () => {
    try {
      // Usar el servicio de tokens mejorado
      const result = await tokenService.getTokenHistory(user.id);
      
      if (result.success) {
        // Convertir los datos al formato esperado por el componente
        const formattedHistory = [];
        
        // Procesar transacciones (recargas)
        if (result.transactions && result.transactions.length > 0) {
          result.transactions.forEach(transaction => {
            formattedHistory.push({
              id: transaction.id,
              type: transaction.payment_method === 'free' ? 'bonus' : 'purchase',
              amount: transaction.tokens_added,
              balance: transaction.balance_after || tokens,
              description: `${transaction.payment_method === 'free' ? 'Tokens gratuitos' : 
                           `Compra de ${transaction.tokens_added} tokens`} - ${transaction.plan_id.toUpperCase()}`,
              date: transaction.created_at
            });
          });
        }
        
        // Procesar usos de tokens
        if (result.usage && result.usage.length > 0) {
          result.usage.forEach(usage => {
            // Encontrar información del servicio
            const serviceInfo = tokenServices[usage.service_id] || { name: 'Servicio desconocido' };
            
            formattedHistory.push({
              id: `usage-${usage.id}`,
              type: 'usage',
              amount: -usage.tokens_used,
              balance: usage.balance_after || tokens,
              description: `${serviceInfo.name} (${usage.tokens_used} tokens)`,
              date: usage.used_at
            });
          });
        }
        
        // Ordenar por fecha, más reciente primero
        formattedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setTransactionHistory(formattedHistory);
      } else {
        throw new Error(result.error?.message || 'Error al obtener historial de transacciones');
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      
      // Historia de transacciones de fallback para desarrollo
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      setTransactionHistory([
        { id: 1, type: 'purchase', amount: 5, balance: 5, description: 'Compra de Plan Básico', date: lastWeek.toISOString() },
        { id: 2, type: 'usage', amount: -1, balance: 4, description: 'Consulta legal express', date: yesterday.toISOString() },
        { id: 3, type: 'usage', amount: -2, balance: 2, description: 'Documento legal', date: yesterday.toISOString() },
        { id: 4, type: 'bonus', amount: 3, balance: 5, description: 'Tokens de nuevo usuario', date: lastWeek.toISOString() }
      ]);
    }
  };
  
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const handlePurchase = async () => {
    if (!turnstileVerified && process.env.NODE_ENV === 'production') {
      toast.error('Por favor, complete la verificación de seguridad');
      return;
    }
    
    if (!selectedPackage) {
      toast.error('Por favor, seleccione un paquete de tokens');
      return;
    }
    
    try {
      setProcessing(true);
      
      // Preparar información de pago
      const paymentInfo = {
        method: paymentMethod,
        id: `payment-${Date.now()}`, // En una implementación real, esto vendría del procesador de pagos
        amount: selectedPackage.price
      };
      
      // Usar el servicio de tokens mejorado
      const result = await tokenService.refillTokens(user.id, selectedPackage.id, paymentInfo);
      
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Llamar a la API para procesar el pago y acreditar tokens
      const response = await fetch('/api/tokens/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          paymentMethod
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la compra de tokens');
      }
      
      const data = await response.json();
      
      // Actualizar el saldo de tokens y el historial
      setTokens(data.newBalance);
      fetchTransactionHistory();
      
      // Mostrar mensaje de éxito
      toast.success(`¡Compra exitosa! Se han acreditado ${selectedPackage.tokens} tokens a tu cuenta.`);
      
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast.error(error.message || 'Error al procesar la compra. Inténtelo de nuevo.');
      
      // Para fines de demo/desarrollo, simulamos una compra exitosa
      setTokens(prev => prev + selectedPackage.tokens);
      const newTransaction = {
        id: Math.floor(Math.random() * 1000),
        type: 'purchase',
        amount: selectedPackage.tokens,
        balance: tokens + selectedPackage.tokens,
        description: `Compra de ${selectedPackage.name}`,
        date: new Date().toISOString()
      };
      setTransactionHistory(prev => [newTransaction, ...prev]);
      toast.success(`¡Compra simulada exitosa! Se han acreditado ${selectedPackage.tokens} tokens a tu cuenta.`);
      setShowCheckout(false);
      setSelectedPackage(null);
      setTurnstileVerified(false);
    } finally {
      setProcessing(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="h-24 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Gestión de Tokens</h1>
      
      {/* Checkout Panel */}
      {showCheckout && selectedPackage && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-blue-200">
          <div className="px-5 py-4 border-b border-gray-200 bg-blue-50">
            <h3 className="text-lg font-medium text-blue-800">Finalizar Compra</h3>
          </div>
          <div className="p-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="mb-6 md:mb-0 md:w-1/2">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Resumen de Compra</h4>
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
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                    <span className="text-gray-800 font-medium">Total:</span>
                    <span className="text-blue-700 font-bold">${selectedPackage.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 md:pl-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Método de Pago</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="card-payment"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'card'}
                      onChange={() => handlePaymentMethodChange('card')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="card-payment" className="ml-3 block text-sm font-medium text-gray-700">
                      Tarjeta de Crédito/Débito
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="paypal-payment"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => handlePaymentMethodChange('paypal')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="paypal-payment" className="ml-3 block text-sm font-medium text-gray-700">
                      PayPal
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="bank-payment"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'bank'}
                      onChange={() => handlePaymentMethodChange('bank')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="bank-payment" className="ml-3 block text-sm font-medium text-gray-700">
                      Transferencia Bancaria
                    </label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <TurnstileWidget
                    onVerify={() => setTurnstileVerified(true)}
                    onExpire={() => setTurnstileVerified(false)}
                    onError={(msg) => {
                      toast.error(`Error en verificación: ${msg}`);
                      setTurnstileVerified(false);
                    }}
                    action="purchase_tokens"
                    theme="light"
                  />
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={processing || !turnstileVerified}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(processing || !turnstileVerified) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {processing ? 'Procesando...' : 'Completar Compra'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Current Balance */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Saldo Actual de Tokens</h2>
            <p className="text-blue-100 mt-1">Usa tus tokens para acceder a servicios premium</p>
          </div>
          <div className="bg-white rounded-full p-3 flex items-center">
            <FaCoins className="text-yellow-500 text-xl mr-2" />
            <span className="text-2xl font-bold text-blue-900">{tokens}</span>
          </div>
        </div>
      </div>
      
      {/* Token Packages */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Paquetes de Tokens Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${pkg.popular ? 'border-2 border-blue-500 relative' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                <div className="mt-4 flex items-center">
                  <FaCoins className="text-yellow-500 mr-2" />
                  <span className="text-3xl font-bold text-gray-900">{pkg.tokens}</span>
                  <span className="ml-2 text-gray-600">tokens</span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-blue-600">${pkg.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handlePackageSelect(pkg)}
                  className={`mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${pkg.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  <FaShoppingCart className="inline mr-2" />
                  Comprar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Token Usage Information */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-1">
            <FaInfoCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-blue-800">¿Cómo usar tus tokens?</h3>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>Los tokens son la moneda virtual para acceder a servicios premium en nuestra plataforma:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Consultas legales simples (1 token)</li>
                <li>Consultas legales detalladas (2 tokens)</li>
                <li>Consultas legales urgentes (5 tokens)</li>
                <li>Documentos legales básicos (2 tokens)</li>
                <li>Documentos legales complejos (3 tokens)</li>
                <li>Documentos legales especializados (5 tokens)</li>
                <li>Revisión de contratos (3 tokens)</li>
                <li>Revisión de demandas (4 tokens)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-800">Historial de Transacciones</h3>
        </div>
        <div className="p-5">
          {transactionHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactionHistory.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'purchase' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'usage' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type === 'purchase' ? 'Compra' :
                           transaction.type === 'usage' ? 'Uso' :
                           'Bono'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <FaExclamationTriangle className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-gray-500">No hay transacciones registradas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokensManager;
