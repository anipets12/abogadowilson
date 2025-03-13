import React from 'react';

const PayPalButton = ({ amount }) => {
  const handlePayment = () => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    const paypalUrl = `https://www.paypal.com/payment?client-id=${clientId}&amount=${amount}`;
    window.location.href = paypalUrl;
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Pagar ${amount} con PayPal
    </button>
  );
};

export default PayPalButton;
