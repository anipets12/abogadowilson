import React, { useEffect, useState } from 'react';
import { FaSpinner, FaExclamationTriangle, FaWhatsapp, FaSync, FaTools, FaInfoCircle } from 'react-icons/fa';
import { socialMedia } from '../../config/appConfig';
import { toast } from 'react-hot-toast';

/**
 * Componente para mostrar cuando hay errores de carga o problemas de conexión
 * Brinda opciones para recuperación y contacto alternativo
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.error - Indica si hay un error presente
 * @param {string} props.errorMessage - Mensaje de error para mostrar
 * @param {Function} props.retry - Función para reintentar la carga
 * @param {boolean} props.showDiagnostic - Indica si se debe mostrar información de diagnóstico
 */
const FallbackLoader = ({ error, errorMessage, retry, showDiagnostic }) => {
  const [countdown, setCountdown] = useState(10);
  const [showingDiagnostic, setShowingDiagnostic] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState(null);
  
  useEffect(() => {
    // Auto-retry countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && retry) {
      retry();
    }
  }, [countdown, retry]);
  
  // Recopilar información de diagnóstico
  useEffect(() => {
    if (showDiagnostic || showingDiagnostic) {
      const collectDiagnosticInfo = () => {
        try {
          const info = {
            userAgent: window.navigator.userAgent,
            url: window.location.href,
            date: new Date().toISOString(),
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            cookies: navigator.cookieEnabled,
            storage: typeof localStorage !== 'undefined',
            online: navigator.onLine
          };
          setDiagnosticInfo(info);
        } catch (e) {
          console.error('Error recopilando información de diagnóstico:', e);
        }
      };
      
      collectDiagnosticInfo();
    }
  }, [showDiagnostic, showingDiagnostic]);
  
  // Función para reintentar con proxímity
  const retryWithProxy = () => {
    try {
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem('use_proxy', 'true');
        toast.success('Activado modo de compatibilidad');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (e) {
      console.error('Error activando proxy:', e);
      if (retry) retry();
    }
  };
  
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
            {errorMessage || (error 
              ? 'Estamos experimentando dificultades técnicas para cargar la aplicación.'
              : 'Estamos preparando todo para una mejor experiencia legal...')}
          </p>
          
          {error && (
            <div className="mt-4 flex flex-col space-y-3">
              <button 
                onClick={retry}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <FaSync className="mr-2" /> Reintentar {countdown > 0 ? `(${countdown})` : ''}
              </button>
              
              <button 
                onClick={retryWithProxy}
                className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                <FaTools className="mr-2" /> Activar Modo Compatibilidad
              </button>
              
              <button 
                onClick={() => setShowingDiagnostic(!showingDiagnostic)}
                className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                <FaInfoCircle className="mr-2" /> {showingDiagnostic ? 'Ocultar Diagnóstico' : 'Mostrar Diagnóstico'}
              </button>
              
              {showingDiagnostic && diagnosticInfo && (
                <div className="mt-2 p-3 bg-gray-100 rounded text-left text-xs font-mono overflow-auto max-h-40">
                  <h3 className="font-bold mb-1">Información de Diagnóstico:</h3>
                  <ul className="space-y-1">
                    {Object.entries(diagnosticInfo).map(([key, value]) => (
                      <li key={key}><span className="font-semibold">{key}:</span> {String(value)}</li>
                    ))}
                  </ul>
                </div>
              )}
              
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
