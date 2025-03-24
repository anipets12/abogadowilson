import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateLegalAdvice } from '../../utils/openai';
import { dataService, authService } from '../../services/apiService';

// Componente para consultas de IA
const AIConsultation = () => {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState('');
  const [recentQueries, setRecentQueries] = useState([]);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);
  const [user, setUser] = useState(null);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const checkUser = async () => {
      const { user } = await authService.getCurrentUser();
      if (user) {
        setUser(user);
      }
    };
    
    checkUser();
    
    const handleAuthChange = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        authService.getCurrentUser().then(({ user }) => {
          if (user) setUser(user);
        });
      } else {
        setUser(null);
      }
    };

    const interval = setInterval(handleAuthChange, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Cargar consultas recientes si el usuario está autenticado
  useEffect(() => {
    if (user) {
      const fetchRecentQueries = async () => {
        try {
          const { data, error } = await dataService.search('legal_queries', {
            userId: user.id,
            limit: 5
          });

          if (error) throw error;
          setRecentQueries(data || []);
        } catch (err) {
          console.error('Error al cargar consultas recientes:', err);
          setRecentQueries([]);
        }
      };

      fetchRecentQueries();
    }
  }, [user]);

  // Manejar la consulta
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Por favor, ingrese su consulta legal');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    setAdvice('');
    
    try {
      const result = await generateLegalAdvice(query, area);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al procesar la consulta');
      }
      
      setAdvice(result.advice);
      
      if (user) {
        await dataService.insert('legal_queries', {
          userId: user.id,
          query,
          area,
          response: result.advice
        });
          
        const { data } = await dataService.search('legal_queries', {
          userId: user.id,
          limit: 5
        });
          
        setRecentQueries(data || []);
      }
      
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error en consulta:', err);
      setError(err.message || 'Error al procesar su consulta. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar una consulta anterior
  const loadPreviousQuery = (prevQuery, prevArea) => {
    setQuery(prevQuery);
    setArea(prevArea);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Áreas de especialidad
  const areas = [
    { value: 'general', label: 'Consulta General' },
    { value: 'penal', label: 'Derecho Penal' },
    { value: 'transito', label: 'Derecho de Tránsito' },
    { value: 'civil', label: 'Derecho Civil' },
    { value: 'comercial', label: 'Derecho Comercial' },
    { value: 'aduanas', label: 'Derecho Aduanero' }
  ];

  return (
    <div className="bg-white py-8 px-4 shadow-md rounded-lg max-w-4xl mx-auto my-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Consulta Legal con IA</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Reciba una orientación preliminar sobre su consulta legal. 
          Nuestra IA especializada le proporcionará información general basada en las leyes ecuatorianas.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Nota: Esta herramienta proporciona información general y no sustituye el asesoramiento legal profesional.</p>
          <p>Para consultas específicas, le recomendamos contactar directamente con el Abg. Wilson Ipiales.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                Área Legal
              </label>
              <select
                id="area"
                name="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {areas.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                Su Consulta Legal
              </label>
              <textarea
                id="query"
                name="query"
                rows={6}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describa su situación legal o consulta con el mayor detalle posible..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : 'Consultar'}
              </button>
            </div>
          </form>
          
          {advice && (
            <motion.div 
              ref={resultRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Respuesta a su consulta:</h3>
              <div className="prose max-w-none text-gray-700">
                {advice.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Para una asesoría completa y personalizada, contacte directamente al Abg. Wilson Ipiales:
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/593988835269?text=Hola, me interesa una consulta legal sobre mi caso"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="white" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href="tel:+593988835269"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Llamar
                  </a>
                  <a
                    href="mailto:alexip2@hotmail.com?subject=Consulta Legal"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Áreas de Especialización</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Derecho Penal
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Derecho de Tránsito
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Derecho Civil
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Derecho Comercial
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Derecho Aduanero
              </li>
            </ul>
          
            {user && recentQueries.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Consultas Recientes</h3>
                <ul className="divide-y divide-gray-200">
                  {recentQueries.map((item, index) => (
                    <li key={index} className="py-3">
                      <button
                        onClick={() => loadPreviousQuery(item.query, item.area)}
                        className="text-left w-full"
                      >
                        <p className="text-sm font-medium text-blue-700 hover:text-blue-800 truncate">
                          {item.query.length > 60 ? `${item.query.substring(0, 60)}...` : item.query}
                        </p>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500 capitalize">{item.area}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">¿Necesita ayuda profesional?</h4>
              <p className="text-sm text-blue-700 mb-4">
                Contacte directamente al Abg. Wilson Ipiales para una consulta personalizada y asesoramiento legal completo.
              </p>
              <div className="text-sm text-gray-700 space-y-2">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra
                </p>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +593 988835269
                </p>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  alexip2@hotmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultation;
