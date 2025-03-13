import React, { useState } from 'react';
import PayPalButton from './PayPalButton';
import WhatsAppPayment from './WhatsAppPayment';
import BankTransfer from './BankTransfer';

const CheckoutForm = ({ serviceName, amount }) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Pagar por {serviceName}</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Seleccione Método de Pago</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setPaymentMethod('paypal')}
            className={`p-4 rounded-lg border ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'} transition-all`}
          >
            <img src="/icons/paypal.svg" alt="PayPal" className="w-24 mx-auto mb-2" />
            <span className="text-sm font-medium">Pagar con PayPal</span>
          </button>

          <button
            onClick={() => setPaymentMethod('whatsapp')}
            className={`p-4 rounded-lg border ${paymentMethod === 'whatsapp' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'} transition-all`}
          >
            <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-24 mx-auto mb-2" />
            <span className="text-sm font-medium">Transferencia por WhatsApp</span>
          </button>

          <button
            onClick={() => setPaymentMethod('bank')}
            className={`p-4 rounded-lg border ${paymentMethod === 'bank' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'} transition-all`}
          >
            <img src="/icons/bank.svg" alt="Banco" className="w-24 mx-auto mb-2" />
            <span className="text-sm font-medium">Depósito Bancario</span>
          </button>
        </div>

        <div className="mt-6">
          {paymentMethod === 'paypal' && <PayPalButton amount={amount} />}
          {paymentMethod === 'whatsapp' && <WhatsAppPayment amount={amount} />}
          {paymentMethod === 'bank' && <BankTransfer amount={amount} />}
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
