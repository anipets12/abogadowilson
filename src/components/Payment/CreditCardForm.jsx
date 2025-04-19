import React, { useState } from 'react';
import { FaCreditCard, FaLock, FaRegCreditCard } from 'react-icons/fa';

const CreditCardForm = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false
  });
  
  const [cardType, setCardType] = useState(null);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  
  // Función para detectar el tipo de tarjeta basado en el número
  const detectCardType = (number) => {
    const regexPattern = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    };
    
    for (const card in regexPattern) {
      if (number.replace(/\s+/g, '').match(regexPattern[card])) {
        return card;
      }
    }
    return null;
  };
  
  const formatCardNumber = (value) => {
    // Eliminar espacios y caracteres no numéricos
    const v = value.replace(/\s+/g, '').replace(/\D/g, '');
    
    // Formatear con espacios cada 4 dígitos
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = value;
    
    // Formateo específico para número de tarjeta
    if (name === 'cardNumber') {
      updatedValue = formatCardNumber(value);
      const cardTypeDetected = detectCardType(updatedValue);
      setCardType(cardTypeDetected);
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : updatedValue
    });
    
    // Limpiar errores cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleFocus = (name) => {
    setFocused(name);
  };
  
  const handleBlur = () => {
    setFocused(null);
    
    // Validar cuando pierde el foco
    validateField(event.target.name, event.target.value);
  };
  
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'cardNumber':
        if (!value.trim()) {
          newErrors.cardNumber = 'El número de tarjeta es requerido';
        } else if (value.replace(/\s+/g, '').length < 13) {
          newErrors.cardNumber = 'Número de tarjeta inválido';
        } else {
          newErrors.cardNumber = null;
        }
        break;
      case 'cardName':
        if (!value.trim()) {
          newErrors.cardName = 'El nombre en la tarjeta es requerido';
        } else {
          newErrors.cardName = null;
        }
        break;
      case 'expiryMonth':
        if (!value) {
          newErrors.expiryMonth = 'Requerido';
        } else {
          newErrors.expiryMonth = null;
        }
        break;
      case 'expiryYear':
        if (!value) {
          newErrors.expiryYear = 'Requerido';
        } else {
          newErrors.expiryYear = null;
        }
        break;
      case 'cvv':
        if (!value.trim()) {
          newErrors.cvv = 'El CVV es requerido';
        } else if (!/^\d{3,4}$/.test(value)) {
          newErrors.cvv = 'CVV inválido';
        } else {
          newErrors.cvv = null;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return !newErrors[name];
  };
  
  // Generar años para la expiración
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 12; i++) {
      years.push(currentYear + i);
    }
    return years;
  };
  
  // Generar meses para la expiración
  const months = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    return num < 10 ? `0${num}` : `${num}`;
  });
  
  // Obtener icono según tipo de tarjeta
  const getCardIcon = () => {
    if (!cardType) return <FaRegCreditCard className="text-gray-400" />;
    
    switch (cardType) {
      case 'visa':
        return <img src="/images/payment/visa.svg" alt="Visa" className="h-6" />;
      case 'mastercard':
        return <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6" />;
      case 'amex':
        return <img src="/images/payment/amex.svg" alt="American Express" className="h-6" />;
      case 'discover':
        return <img src="/images/payment/discover.svg" alt="Discover" className="h-6" />;
      default:
        return <FaRegCreditCard className="text-gray-400" />;
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-5 mb-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <div className="bg-yellow-400 h-10 w-14 rounded-md mb-3"></div>
            <div className="text-xl font-mono text-white tracking-widest pb-1">
              {formData.cardNumber || '•••• •••• •••• ••••'}
            </div>
          </div>
          <div className="mt-2">
            {getCardIcon()}
          </div>
        </div>
        
        <div className="flex justify-between mt-3">
          <div>
            <div className="text-xs text-blue-200 uppercase">Titular</div>
            <div className="text-white font-mono tracking-wider">
              {formData.cardName || 'NOMBRE DEL TITULAR'}
            </div>
          </div>
          <div>
            <div className="text-xs text-blue-200 uppercase">Expira</div>
            <div className="text-white font-mono tracking-wider">
              {formData.expiryMonth || 'MM'}/{formData.expiryYear?.toString().slice(-2) || 'AA'}
            </div>
          </div>
        </div>
      </div>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Número de tarjeta</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCreditCard className="text-gray-400" />
            </div>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              onFocus={() => handleFocus('cardNumber')}
              onBlur={handleBlur}
              placeholder="1234 5678 9012 3456"
              className={`block w-full pl-10 pr-10 py-2 border ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              maxLength="19"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {getCardIcon()}
            </div>
          </div>
          {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
        </div>
        
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Nombre en la tarjeta</label>
          <div className="mt-1">
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              onFocus={() => handleFocus('cardName')}
              onBlur={handleBlur}
              placeholder="Nombres y apellidos como aparecen en la tarjeta"
              className={`block w-full py-2 px-3 border ${errors.cardName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
          {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Fecha de expiración</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <select
                id="expiryMonth"
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleChange}
                onFocus={() => handleFocus('expiryMonth')}
                onBlur={handleBlur}
                className={`block w-full py-2 px-3 border ${errors.expiryMonth ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Mes</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              
              <select
                id="expiryYear"
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleChange}
                onFocus={() => handleFocus('expiryYear')}
                onBlur={handleBlur}
                className={`block w-full py-2 px-3 border ${errors.expiryYear ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Año</option>
                {generateYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {(errors.expiryMonth || errors.expiryYear) && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryMonth || errors.expiryYear}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
            <div className="mt-1 relative">
              <input
                type="password"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                onFocus={() => handleFocus('cvv')}
                onBlur={handleBlur}
                placeholder="123"
                maxLength="4"
                className={`block w-full py-2 px-3 border ${errors.cvv ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
            </div>
            {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="saveCard"
            name="saveCard"
            type="checkbox"
            checked={formData.saveCard}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
            Guardar esta tarjeta para futuros pagos
          </label>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center text-xs text-gray-500">
            <FaLock className="mr-1 text-green-500" /> 
            <span>Sus datos son cifrados y protegidos con seguridad SSL</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreditCardForm;
