import React from 'react';

const WhatsAppPayment = ({ amount }) => {
  const handlePayment = () => {
    const message = encodeURIComponent(`Hola, quiero realizar un pago de $${amount} por transferencia.`);
    window.open(`https://wa.me/593988835269?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
    >
      Pagar ${amount} por WhatsApp
    </button>
  );
};

export default WhatsAppPayment;
