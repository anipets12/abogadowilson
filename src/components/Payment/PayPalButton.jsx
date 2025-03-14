import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PayPalButton = ({ amount }) => {
  const paypalRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar el script de PayPal
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AYgjCNgWXLjGXcZAw2ht7V40l7cqF6JEqPzZgP9QoKQJBNB53cEZKGkPJHoZi5diyYP_OTmPbyvKQxDg&currency=USD`;
    script.addEventListener('load', () => setLoaded(true));
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [amount]);

  const setLoaded = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Servicios legales - Abg. Wilson Ipiales',
                amount: {
                  currency_code: 'USD',
                  value: amount
                }
              }
            ],
            application_context: {
              shipping_preference: 'NO_SHIPPING'
            }
          });
        },
        onApprove: async (data, actions) => {
          try {
            const order = await actions.order.capture();
            console.log('Pago completado', order);
            
            // Aquí puedes guardar la información del pago en tu base de datos
            // usando Supabase antes de redirigir

            // Redirigir a página de agradecimiento
            navigate('/gracias', { 
              state: { 
                paymentId: order.id,
                amount: amount,
                status: 'completed'
              } 
            });
          } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Hubo un problema al procesar su pago. Por favor, inténtelo de nuevo.');
          }
        },
        onError: (err) => {
          console.error('Error PayPal:', err);
          alert('Ocurrió un error con PayPal. Por favor, inténtelo más tarde.');
        }
      }).render(paypalRef.current);
    }
  };

  return (
    <div className="mt-4">
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-gray-700 mb-2">Detalles del pago:</p>
        <p className="text-lg font-semibold">${amount} USD</p>
        <p className="text-xs text-gray-500 mt-1">Pagos seguros procesados por PayPal</p>
      </div>
      
      <div ref={paypalRef} className="mt-4"></div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        Al completar el pago, usted acepta nuestros términos y condiciones.
      </p>
    </div>
  );
};

export default PayPalButton;
