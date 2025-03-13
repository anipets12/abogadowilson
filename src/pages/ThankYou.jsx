import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-4xl font-bold text-green-600 mb-4'>¡Gracias por tu compra!</h1>
      <p className='text-lg text-gray-700'>Tu pago ha sido procesado exitosamente. Pronto recibirás un correo con los detalles de tu compra.</p>
      <button onClick={() => navigate('/dashboard')} className='mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Ir a mi dashboard</button>
    </div>
  );
};

export default ThankYou;
