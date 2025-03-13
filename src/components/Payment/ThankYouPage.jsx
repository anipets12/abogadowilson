import React from 'react';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
        <p className="text-gray-700 mb-4">Tu pago se ha procesado correctamente. En breve recibirás un correo electrónico con los detalles de tu compra.</p>
        <a href="/" className="text-blue-500 underline">Volver al inicio</a>
      </div>
    </div>
  );
};

export default ThankYouPage;
