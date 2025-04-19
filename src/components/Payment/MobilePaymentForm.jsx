import React, { useState } from 'react';
import { FaMobileAlt, FaCheck, FaSpinner, FaCopy, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const MobilePaymentForm = ({ amount }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState('movistar');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [step, setStep] = useState(1); // 1: Selección de proveedor, 2: Ingreso de código, 3: Confirmado
  
  const providers = [
    { id: 'movistar', name: 'Movistar', color: 'blue', icon: '/images/payment/movistar.svg' },
    { id: 'claro', name: 'Claro', color: 'red', icon: '/images/payment/claro.svg' },
    { id: 'cnt', name: 'CNT', color: 'yellow', icon: '/images/payment/cnt.svg' },
    { id: 'tuenti', name: 'Tuenti', color: 'purple', icon: '/images/payment/tuenti.svg' }
  ];
  
  const formatPhoneNumber = (value) => {
    // Eliminar caracteres no numéricos
    const cleaned = value.replace(/\D/g, '');
    
    // Aplicar formato: (09) xxxx-xxxx
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2)}`;
    }
    if (cleaned.length > 6) {
      formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
    }
    
    return formatted;
  };
  
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };
  
  const handleProviderChange = (providerId) => {
    setProvider(providerId);
  };
  
  const handleSendCode = async () => {
    // Validar número de teléfono
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      toast.error('Por favor, ingrese un número de teléfono válido');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulación de envío de código por SMS
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar un código aleatorio de 6 dígitos
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setConfirmationCode(randomCode);
      
      // Generar referencia de pago
      const reference = 'PAG-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      setPaymentReference(reference);
      
      toast.success(`Se ha enviado un código de verificación a ${phoneNumber}`);
      setStep(2);
    } catch (error) {
      toast.error('Error al enviar el código. Intente nuevamente.');
      console.error('Error sending code:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    // Obtener el código ingresado
    const enteredCode = e.target.elements.verificationCode.value;
    
    if (!enteredCode || enteredCode.length !== 6) {
      toast.error('Ingrese el código de 6 dígitos');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulación de verificación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En un entorno real, aquí verificaríamos el código con el backend
      // Para demo, aceptamos cualquier código de 6 dígitos
      setVerified(true);
      setStep(3);
      toast.success('Pago verificado exitosamente');
    } catch (error) {
      toast.error('Error al verificar el código');
      console.error('Error verifying code:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const copyReferenceToClipboard = () => {
    navigator.clipboard.writeText(paymentReference);
    toast.success('Referencia copiada al portapapeles');
  };
  
  const getWhatsAppLink = () => {
    const message = `Hola, quisiera confirmar mi pago con referencia: ${paymentReference} por un valor de $${amount.toFixed(2)} USD`;
    return `https://wa.me/593987654321?text=${encodeURIComponent(message)}`;
  };
  
  // Renderizar según el paso actual
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Seleccione su proveedor</label>
              <div className="grid grid-cols-2 gap-4">
                {providers.map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => handleProviderChange(prov.id)}
                    className={`flex items-center justify-center p-3 border rounded-lg ${provider === prov.id ? `ring-2 ring-${prov.color}-500 bg-${prov.color}-50` : 'border-gray-300'}`}
                  >
                    <img src={prov.icon} alt={prov.name} className="h-8 mr-2" />
                    <span className="font-medium">{prov.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Número de teléfono</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMobileAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="(09) xxxx-xxxx"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  maxLength="14"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Ingrese el número asociado a su cuenta de {providers.find(p => p.id === provider)?.name}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">¿Cómo funciona?</h3>
              <ol className="text-sm text-blue-700 list-decimal pl-5 space-y-1">
                <li>Ingrese su número de teléfono asociado a {providers.find(p => p.id === provider)?.name}</li>
                <li>Recibirá un SMS con un código de verificación</li>
                <li>Ingrese el código para confirmar el pago</li>
                <li>El valor se cargará a su factura mensual o saldo prepago</li>
              </ol>
            </div>
            
            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading || phoneNumber.replace(/\D/g, '').length !== 10}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(loading || phoneNumber.replace(/\D/g, '').length !== 10) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                'Enviar código de verificación'
              )}
            </button>
          </>
        );
        
      case 2:
        return (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <FaMobileAlt className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Verificación por SMS</h3>
              <p className="text-sm text-gray-600">Hemos enviado un código de verificación a</p>
              <p className="text-base font-medium text-gray-800">{phoneNumber}</p>
            </div>
            
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">Código de verificación</label>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  placeholder="Ingrese el código de 6 dígitos"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  maxLength="6"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Verificando...
                  </>
                ) : (
                  'Verificar y completar pago'
                )}
              </button>
              
              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Volver atrás
                </button>
              </div>
            </form>
          </>
        );
        
      case 3:
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <FaCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">¡Pago Verificado!</h3>
            <p className="text-base text-gray-700 mb-6">Su pago por <span className="font-semibold">${amount.toFixed(2)} USD</span> ha sido verificado exitosamente.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Referencia:</span>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 mr-2">{paymentReference}</span>
                  <button 
                    onClick={copyReferenceToClipboard}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Estado:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Confirmado
                </span>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">Recibirá un mensaje de confirmación a su número de teléfono y se le enviará un recibo a su correo electrónico.</p>
            </div>
            
            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 mb-4"
            >
              <FaWhatsapp className="mr-2" /> Confirmar por WhatsApp
            </a>
            
            <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
              Volver al panel principal
            </a>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white p-6 rounded-lg">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default MobilePaymentForm;
