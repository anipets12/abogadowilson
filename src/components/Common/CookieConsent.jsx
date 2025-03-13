import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookieBite, FaTimes } from 'react-icons/fa';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó las cookies
    const consentAccepted = localStorage.getItem('cookieConsentAccepted');
    if (!consentAccepted) {
      // Mostrar el banner después de 2 segundos de carga de la página
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsentAccepted', 'true');
    setShowConsent(false);
  };

  const handleClose = () => {
    setShowConsent(false);
    // Volverá a aparecer en la próxima sesión si no se acepta
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white shadow-lg border-t border-gray-200"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-start mb-4 md:mb-0 md:mr-8">
                <div className="text-primary-600 mr-4">
                  <FaCookieBite className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Valoramos su privacidad</h3>
                  <p className="text-sm text-gray-600">
                    Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio, 
                    personalizar el contenido y ofrecer una navegación más segura. Al hacer clic en "Aceptar", 
                    consiente el uso de estas tecnologías para procesar sus datos.
                  </p>
                  <a href="/privacidad" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                    Más información sobre nuestra política de cookies
                  </a>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Aceptar
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
