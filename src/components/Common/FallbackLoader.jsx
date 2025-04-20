import React, { useEffect, useState } from 'react';
import { FaSpinner, FaExclamationTriangle, FaWhatsapp, FaSync } from 'react-icons/fa';
import { socialMedia } from '../../config/appConfig';

/**
 * Componente para mostrar cuando hay errores de carga o problemas de conexión
 * Brinda opciones para recuperación y contacto alternativo
 */
const FallbackLoader = ({ error, retry }) => {
  const [countdown, setCountdown] = useState(10);
  
  useEffect(() => {
    // Auto-retry countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && retry) {
      retry();
    }
  }, [countdown, retry]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          {error ? (
            <FaExclamationTriangle className="w-16 h-16 mx-auto text-red-500" />
          ) : (
            <FaSpinner className="w-16 h-16 mx-auto text-blue-500 animate-spin" />
          )}
          
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {error ? 'Problemas de Conexión' : 'Cargando Aplicación'}
          </h2>
          
          <p className="mt-2 text-gray-600">
            {error 
              ? 'Estamos experimentando dificultades técnicas para cargar la aplicación.'
              : 'Estamos preparando todo para una mejor experiencia legal...'}
          </p>
          
          {error && (
            <div className="mt-4">
              <button 
                onClick={retry}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <FaSync className="mr-2" /> Reintentar {countdown > 0 ? `(${countdown})` : ''}
              </button>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-700 mb-3">
                  También puede contactar directamente al Abg. Wilson Ipiales:
                </p>
                <a 
                  href={socialMedia.whatsapp.api}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  <FaWhatsapp className="mr-2" /> Contactar por WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Logo y derechos */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold text-gray-800">Abogado Wilson Ipiales</h3>
        <p className="mt-2 text-sm text-gray-600">
          Especialista en Derecho Penal y Civil
        </p>
        <p className="mt-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};

export default FallbackLoader;
