import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilePdf, FaWhatsapp, FaHome, FaCopy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import Footer from '../components/Footer/Footer';

const BankTransferPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener detalles de la orden de location.state
  const { orderId, amount, billingInfo } = location.state || {};
  
  // Si no hay información de la orden, redirigir a la página principal
  React.useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);
  
  // Función para copiar al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copiado al portapapeles');
    });
  };
  
  // Formatear fecha actual
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Generar mensaje para WhatsApp
  const whatsappMessage = encodeURIComponent(
    `*Confirmación de Transferencia Bancaria*\n\n` +
    `Hola, soy ${billingInfo?.name}.\n` +
    `He realizado una transferencia para el pedido: ${orderId}.\n` +
    `Monto: $${parseFloat(amount).toFixed(2)} USD\n` +
    `Fecha: ${currentDate}\n\n` +
    `Por favor, confirma la recepción del pago.`
  );
  
  return (
    <>
      <Helmet>
        <title>Instrucciones de Transferencia Bancaria | Abg. Wilson Ipiales</title>
        <meta name="description" content="Instrucciones para completar su pago mediante transferencia bancaria" />
      </Helmet>
      
      <main className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Instrucciones de Pago</h1>
              <p className="text-gray-600">
                Su orden ha sido registrada. Para completar su compra, realice una transferencia bancaria.
              </p>
            </div>
            
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6 mb-4 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles de la Orden</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID de Orden:</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{orderId}</span>
                      <button 
                        onClick={() => copyToClipboard(orderId)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span>{currentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      Pendiente
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monto a Transferir:</span>
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">${parseFloat(amount).toFixed(2)} USD</span>
                      <button 
                        onClick={() => copyToClipboard(parseFloat(amount).toFixed(2))}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos Bancarios</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banco:</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Banco Pichincha</span>
                      <button 
                        onClick={() => copyToClipboard("Banco Pichincha")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo de Cuenta:</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Corriente</span>
                      <button 
                        onClick={() => copyToClipboard("Corriente")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de Cuenta:</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">2203728320</span>
                      <button 
                        onClick={() => copyToClipboard("2203728320")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Titular:</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Wilson Alexander Ipiales Guerron</span>
                      <button 
                        onClick={() => copyToClipboard("Wilson Alexander Ipiales Guerron")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">C.I.:</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">1003385786</span>
                      <button 
                        onClick={() => copyToClipboard("1003385786")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-8">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Una vez realizada la transferencia, por favor notifique el pago a través de WhatsApp junto con el comprobante de la transferencia para agilizar la confirmación.
              </p>
            </div>
            
            <div className="space-y-4">
              <a 
                href={`https://wa.me/593992529049?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaWhatsapp className="mr-2" /> 
                Notificar Pago por WhatsApp
              </a>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => window.print()} 
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaFilePdf className="mr-2" /> 
                  Descargar Instrucciones
                </button>
                
                <Link 
                  to="/" 
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaHome className="mr-2" />
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BankTransferPage;
