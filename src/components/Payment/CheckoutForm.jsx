import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCreditCard, FaMoneyBillWave, FaPaypal, FaMobileAlt, FaQrcode, FaUniversity, FaCoins, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import PayPalButton from './PayPalButton';
import WhatsAppPayment from './WhatsAppPayment';
import BankTransfer from './BankTransfer';
import CreditCardForm from './CreditCardForm';
import MobilePaymentForm from './MobilePaymentForm';
import TurnstileWidget from '../TurnstileWidget';

const CheckoutForm = () => {
  const { user, tokenBalance, updateTokenBalance } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState(user?.email || '');
  const [sendReceipt, setSendReceipt] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [packages, setPackages] = useState([]);
  
  // Obtener datos de la URL si existen
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const packageId = queryParams.get('package');
    const amount = queryParams.get('amount');
    const service = queryParams.get('service');
    
    if (packageId) {
      fetchTokenPackages(packageId);
    } else {
      fetchTokenPackages();
    }
    
    if (amount) {
      setCustomAmount(amount);
    }
  }, [location]);
  
  // Cargar paquetes de tokens disponibles
  const fetchTokenPackages = async (preselectedId = null) => {
    try {
      setLoading(true);
      const response = await fetch('/api/tokens/packages');
      
      if (!response.ok) throw new Error('Error al obtener paquetes de tokens');
      
      const data = await response.json();
      setPackages(data);
      
      // Preseleccionar un paquete si se proporcionó un ID
      if (preselectedId) {
        const selectedPkg = data.find(pkg => pkg.id === parseInt(preselectedId));
        if (selectedPkg) {
          setSelectedPackage(selectedPkg);
        }
      }
    } catch (error) {
      console.error('Error fetching token packages:', error);
      // Paquetes de fallback para desarrollo
      const fallbackPackages = [
        { id: 1, name: 'Paquete Básico', tokens: 50, price: 15.99, popular: false, save: '0%' },
        { id: 2, name: 'Paquete Estándar', tokens: 120, price: 29.99, popular: true, save: '20%' },
        { id: 3, name: 'Paquete Premium', tokens: 300, price: 59.99, popular: false, save: '33%' },
        { id: 4, name: 'Paquete Empresarial', tokens: 1000, price: 149.99, popular: false, save: '50%' }
      ];
      setPackages(fallbackPackages);
      
      if (preselectedId) {
        const selectedPkg = fallbackPackages.find(pkg => pkg.id === parseInt(preselectedId));
        if (selectedPkg) {
          setSelectedPackage(selectedPkg);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setCustomAmount('');
  };
  
  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedPackage(null);
  };
  
  const getTotal = () => {
    if (selectedPackage) {
      return selectedPackage.price;
    }
    
    if (customAmount && !isNaN(customAmount)) {
      return parseFloat(customAmount);
    }
    
    return 0;
  };
  
  const handlePayment = async () => {
    if (!turnstileVerified) {
      toast.error('Por favor, complete la verificación de seguridad');
      return;
    }
    
    if (!selectedPackage && (!customAmount || isNaN(customAmount) || parseFloat(customAmount) <= 0)) {
      toast.error('Por favor, seleccione un paquete o ingrese un monto válido');
      return;
    }
    
    try {
      setProcessingPayment(true);
      
      // Aquí se integraría con la pasarela de pago real
      // Simulando un pago exitoso para desarrollo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Datos para la API
      const paymentData = {
        amount: getTotal(),
        method: paymentMethod,
        tokens: selectedPackage ? selectedPackage.tokens : Math.floor(parseFloat(customAmount) * 3), // Ratio de 3 tokens por dólar en compra personalizada
        sendReceipt,
        receiptEmail: sendReceipt ? receiptEmail : '',
        package: selectedPackage ? selectedPackage.id : null
      };
      
      // Enviar a la API (simulación)
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({
              success: true,
              transactionId: 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
              newBalance: tokenBalance + paymentData.tokens
            })
          });
        }, 1000);
      });
      
      if (!response.ok) throw new Error('Error al procesar el pago');
      
      const result = await response.json();
      
      if (result.success) {
        // Actualizar el saldo de tokens en el contexto
        updateTokenBalance(result.newBalance);
        
        // Redireccionar a página de agradecimiento
        navigate(`/gracias?tx=${result.transactionId}&tokens=${paymentData.tokens}`);
        
        toast.success('¡Pago procesado exitosamente!');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error al procesar el pago. Por favor, inténtelo nuevamente.');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-1/2 mb-8"></div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-60 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">Adquirir Tokens</h1>
      <p className="text-lg text-gray-600 mb-8">Seleccione un paquete o ingrese un monto personalizado</p>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Paquetes de Tokens */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Paquetes Disponibles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                onClick={() => handlePackageSelect(pkg)}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedPackage?.id === pkg.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow'} relative`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    Más Popular
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-1">{pkg.name}</h3>
                  <div className="flex justify-center items-baseline mb-2">
                    <span className="text-xl font-extrabold text-gray-900">${pkg.price.toFixed(2)}</span>
                    <span className="text-gray-500 ml-1">USD</span>
                  </div>
                  
                  <div className="flex justify-center items-center text-lg font-bold text-blue-600 mb-2">
                    <FaCoins className="mr-1 text-yellow-500" /> {pkg.tokens} tokens
                  </div>
                  
                  {pkg.save && pkg.save !== '0%' && (
                    <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1">
                      Ahorro {pkg.save}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Opción de monto personalizado */}
            <div className={`border rounded-lg p-4 transition-all duration-200 ${!selectedPackage && customAmount ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow'}`}>
              <h3 className="font-bold text-lg mb-3 text-center">Monto Personalizado</h3>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Ingrese monto"
                  min="1"
                  step="0.01"
                  className="pl-7 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {customAmount && !isNaN(customAmount) && parseFloat(customAmount) > 0 && (
                <div className="text-center mt-3">
                  <div className="flex justify-center items-center text-sm font-bold text-blue-600">
                    <FaCoins className="mr-1 text-yellow-500" /> {Math.floor(parseFloat(customAmount) * 3)} tokens
                  </div>
                  <div className="text-xs text-gray-500 mt-1">3 tokens por cada dólar</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Métodos de Pago */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Seleccione Método de Pago</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('credit_card')}
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${paymentMethod === 'credit_card' ? 'bg-blue-100 border-blue-500 border-2' : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
            >
              <FaCreditCard className="text-2xl mb-1 text-blue-600" />
              <span className="text-xs font-medium">Tarjeta</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${paymentMethod === 'paypal' ? 'bg-blue-100 border-blue-500 border-2' : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
            >
              <FaPaypal className="text-2xl mb-1 text-blue-800" />
              <span className="text-xs font-medium">PayPal</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('mobile_payment')}
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${paymentMethod === 'mobile_payment' ? 'bg-blue-100 border-blue-500 border-2' : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
            >
              <FaMobileAlt className="text-2xl mb-1 text-green-600" />
              <span className="text-xs font-medium">Móvil</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('qr_payment')}
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${paymentMethod === 'qr_payment' ? 'bg-blue-100 border-blue-500 border-2' : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
            >
              <FaQrcode className="text-2xl mb-1 text-purple-600" />
              <span className="text-xs font-medium">QR</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('bank_transfer')}
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${paymentMethod === 'bank_transfer' ? 'bg-blue-100 border-blue-500 border-2' : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
            >
              <FaUniversity className="text-2xl mb-1 text-gray-700" />
              <span className="text-xs font-medium">Banco</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${paymentMethod === 'cash' ? 'bg-blue-100 border-blue-500 border-2' : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'}`}
            >
              <FaMoneyBillWave className="text-2xl mb-1 text-green-700" />
              <span className="text-xs font-medium">Efectivo</span>
            </button>
          </div>
        </div>
        
        {/* Formulario de pago según método seleccionado */}
        <div className="p-6 border-b border-gray-200">
          {paymentMethod === 'credit_card' && <CreditCardForm />}
          {paymentMethod === 'paypal' && <PayPalButton amount={getTotal()} />}
          {paymentMethod === 'mobile_payment' && <MobilePaymentForm amount={getTotal()} />}
          {paymentMethod === 'qr_payment' && (
            <div className="text-center py-4">
              <img src="/images/payment-qr.png" alt="Código QR de pago" className="mx-auto w-48 h-48" />
              <p className="mt-3 text-gray-700">Escanee este código QR con su aplicación bancaria para pagar</p>
            </div>
          )}
          {paymentMethod === 'bank_transfer' && <BankTransfer amount={getTotal()} />}
          {paymentMethod === 'cash' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <FaInfoCircle className="text-yellow-500 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-yellow-800">Pago en efectivo</h3>
                  <p className="text-yellow-700 mt-1">Puede realizar el pago en efectivo en nuestra oficina:</p>
                  <p className="text-yellow-700 mt-2">
                    <strong>Dirección:</strong> Av. Amazonas N36-55 y Naciones Unidas, Edificio Unicornio, Piso 5, Oficina 504<br />
                    <strong>Horario de atención:</strong> Lunes a Viernes de 9:00 a 18:00
                  </p>
                  <p className="text-yellow-700 mt-2">Presente el código de reserva que se generará al finalizar este proceso.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Resumen y verificación */}
        <div className="p-6 bg-gray-50">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium text-gray-900">Total a pagar:</h3>
              <div className="text-2xl font-bold text-blue-600">${getTotal().toFixed(2)} USD</div>
              {selectedPackage ? (
                <div className="text-sm text-gray-600 flex items-center mt-1">
                  <FaCoins className="text-yellow-500 mr-1" /> {selectedPackage.tokens} tokens
                </div>
              ) : customAmount && !isNaN(customAmount) && parseFloat(customAmount) > 0 ? (
                <div className="text-sm text-gray-600 flex items-center mt-1">
                  <FaCoins className="text-yellow-500 mr-1" /> {Math.floor(parseFloat(customAmount) * 3)} tokens
                </div>
              ) : null}
            </div>
            
            <div className="flex flex-col">
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendReceipt}
                    onChange={() => setSendReceipt(!sendReceipt)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enviar recibo por email</span>
                </label>
                
                {sendReceipt && (
                  <input
                    type="email"
                    value={receiptEmail}
                    onChange={(e) => setReceiptEmail(e.target.value)}
                    placeholder="Email para recibo"
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                )}
              </div>
              
              <div className="mb-4">
                <TurnstileWidget
                  onVerify={() => setTurnstileVerified(true)}
                  onExpire={() => setTurnstileVerified(false)}
                  onError={() => setTurnstileVerified(false)}
                  action="checkout_payment"
                />
              </div>
              
              <button
                onClick={handlePayment}
                disabled={processingPayment || !turnstileVerified || getTotal() <= 0}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(processingPayment || !turnstileVerified || getTotal() <= 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {processingPayment ? 'Procesando...' : 'Completar Pago'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Información sobre Tokens</h3>
        <p className="text-blue-700">
          Los tokens le permiten acceder a servicios exclusivos en nuestra plataforma, como consultas legales prioritarias, 
          descarga de documentos premium, servicios de redacción legal y más. Una vez adquiridos, no caducan y puede 
          utilizarlos según sus necesidades.          
        </p>
        <div className="mt-3 flex items-center">
          <FaInfoCircle className="text-blue-500 mr-2" />
          <p className="text-sm text-blue-700">
            Si tiene dudas sobre nuestro sistema de tokens, puede consultar la 
            <a href="/faq" className="text-blue-800 font-medium hover:underline ml-1">sección de preguntas frecuentes</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
