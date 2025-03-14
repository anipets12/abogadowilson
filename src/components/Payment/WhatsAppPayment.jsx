import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const WhatsAppPayment = ({ amount }) => {
  const navigate = useNavigate();
  
  const handleWhatsAppPayment = () => {
    const message = encodeURIComponent(
      `Hola Abg. Wilson Ipiales, deseo realizar un pago de $${amount} por sus servicios legales.\n\nPor favor, indíqueme los pasos a seguir para completar el pago.`
    );
    window.open(`https://wa.me/593988835269?text=${message}`, '_blank');
    
    // Opcionalmente, redirigimos al usuario a la página de gracias después de abrir WhatsApp
    setTimeout(() => {
      navigate('/gracias', { 
        state: { 
          paymentMethod: 'whatsapp',
          amount: amount,
          status: 'pending'
        } 
      });
    }, 2000);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Pago vía WhatsApp</h3>
      <p className="text-gray-700 mb-4">
        Al hacer clic en el botón, se abrirá una conversación de WhatsApp con el Abg. Wilson Ipiales donde podrá coordinar su pago de manera segura.
      </p>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
        <p className="text-green-800 text-sm">
          <strong>Ventajas:</strong> Asistencia personalizada, confirmación inmediata y aclaración de cualquier duda sobre su consulta legal.
        </p>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        Número de contacto: +593 988 835 269
      </p>
      
      <button
        onClick={handleWhatsAppPayment}
        className="w-full flex items-center justify-center bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
      >
        <FaWhatsapp className="mr-2 text-xl" />
        Contactar para pagar ${amount}
      </button>
    </div>
  );
};

export default WhatsAppPayment;
