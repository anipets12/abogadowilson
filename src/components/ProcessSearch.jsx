import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dataService } from '../services/apiService';
import { FaSearch, FaSpinner, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa';

const ProcessSearch = () => {
  const [searchParams, setSearchParams] = useState({
    type: 'numero',
    value: '',
    province: 'imbabura'
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  const provinces = [
    { id: 'imbabura', name: 'Imbabura' },
    { id: 'pichincha', name: 'Pichincha' },
    { id: 'guayas', name: 'Guayas' },
    { id: 'azuay', name: 'Azuay' },
    { id: 'manabi', name: 'Manabí' },
    { id: 'loja', name: 'Loja' },
    { id: 'tungurahua', name: 'Tungurahua' },
    { id: 'eloro', name: 'El Oro' },
    { id: 'chimborazo', name: 'Chimborazo' },
    { id: 'esmeraldas', name: 'Esmeraldas' }
  ];

  const searchTypes = [
    { id: 'numero', name: 'Número de Causa' },
    { id: 'actor', name: 'Actor' },
    { id: 'demandado', name: 'Demandado' },
    { id: 'judicatura', name: 'Judicatura' }
  ];

  useEffect(() => {
    // Cargar búsquedas recientes al iniciar
    fetchRecentSearches();
  }, []);

  const fetchRecentSearches = async () => {
    try {
      // Usar método getAll directamente sin esperar from().select()
      const response = await dataService.getAll('searches');
      const { data, error } = response;
      
      if (error) throw error;
      // Ordenar los resultados manualmente si es necesario
      const sortedData = data ? [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5) : [];
      setRecentSearches(sortedData || []);
    } catch (error) {
      console.error('Error al cargar búsquedas recientes:', error);
      setRecentSearches([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchParams.value.trim()) {
      setError('Por favor ingrese un valor para realizar la búsqueda');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      // Guardar la búsqueda en la base de datos
      const searchData = {
        search_type: searchParams.type,
        search_value: searchParams.value,
        province: searchParams.province,
        timestamp: new Date().toISOString()
      };
      
      const { error: insertError } = await dataService.create('searches', searchData);
      if (insertError) throw insertError;

      // Realizar la búsqueda de procesos judiciales
      // Utilizamos el método search personalizado en lugar de from().select()
      const { data, error: searchError } = await dataService.search('judicial_processes', {
        searchType: searchParams.type,
        searchValue: searchParams.value,
        province: searchParams.province
      });

      if (searchError) throw searchError;

      // Si no hay resultados en la base de datos, usar datos de ejemplo
      if (!data || data.length === 0) {
        // Simulación de resultados para demostración
        const mockResults = [
          {
            id: `${searchParams.province}-2023-${Math.floor(Math.random() * 10000)}`,
            tipo: ['PENAL', 'CIVIL', 'TRÁNSITO', 'ADMINISTRATIVO'][Math.floor(Math.random() * 4)],
            actor: searchParams.type === 'actor' ? searchParams.value : 'FISCALÍA GENERAL DEL ESTADO',
            demandado: searchParams.type === 'demandado' ? searchParams.value : 'PERSONA NATURAL/JURÍDICA',
            fecha: new Date().toISOString().split('T')[0],
            estado: ['EN TRÁMITE', 'ARCHIVADO', 'SENTENCIA', 'APELACIÓN'][Math.floor(Math.random() * 4)],
            judicatura: `UNIDAD JUDICIAL DE ${provinces.find(p => p.id === searchParams.province)?.name.toUpperCase() || 'IMBABURA'}`
          },
          {
            id: `${searchParams.province}-2023-${Math.floor(Math.random() * 10000)}`,
            tipo: ['PENAL', 'CIVIL', 'TRÁNSITO', 'ADMINISTRATIVO'][Math.floor(Math.random() * 4)],
            actor: 'JUAN PÉREZ',
            demandado: 'MARÍA LÓPEZ',
            fecha: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0],
            estado: ['EN TRÁMITE', 'ARCHIVADO', 'SENTENCIA', 'APELACIÓN'][Math.floor(Math.random() * 4)],
            judicatura: `UNIDAD JUDICIAL DE ${provinces.find(p => p.id === searchParams.province)?.name.toUpperCase() || 'IMBABURA'}`
          }
        ];
        setResults(mockResults);
      } else {
        setResults(data);
      }

      // Actualizar búsquedas recientes
      fetchRecentSearches();
    } catch (err) {
      setError('Error al realizar la búsqueda. Por favor, intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchParams({
      type: 'numero',
      value: '',
      province: 'imbabura'
    });
    setResults([]);
    setError(null);
  };

  const handleUseRecentSearch = (search) => {
    setSearchParams({
      type: search.search_type,
      value: search.search_value,
      province: search.province
    });
  };

  return (
    <div className="py-12 bg-secondary-50">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Consulta de Procesos Judiciales</h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Busque información actualizada sobre procesos judiciales en Ecuador. 
            Acceda a datos de causas por número, actor, demandado o judicatura.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <motion.form 
                onSubmit={handleSearch} 
                className="card space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Tipo de Búsqueda
                    </label>
                    <select
                      value={searchParams.type}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, type: e.target.value }))}
                      className="input-field"
                    >
                      {searchTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Provincia
                    </label>
                    <select
                      value={searchParams.province}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, province: e.target.value }))}
                      className="input-field"
                    >
                      {provinces.map(province => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Valor de Búsqueda
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchParams.value}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, value: e.target.value }))}
                        className="input-field pl-10"
                        placeholder="Ingrese el valor a buscar"
                        required
                      />
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Buscando...</span>
                      </>
                    ) : (
                      <>
                        <FaSearch />
                        <span>Buscar</span>
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={handleClearSearch}
                    className="btn-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Limpiar
                  </motion.button>
                </div>
              </motion.form>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-3"
                >
                  <FaExclamationTriangle />
                  <span>{error}</span>
                </motion.div>
              )}

              {results.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 space-y-4"
                >
                  <h3 className="text-xl font-semibold text-secondary-900">
                    Resultados ({results.length})
                  </h3>
                  
                  {results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                            <FaFileAlt className="text-blue-500" />
                            {result.id}
                          </h3>
                          <p className="text-secondary-600">
                            Tipo: {result.tipo}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.estado === 'EN TRÁMITE'
                            ? 'bg-green-100 text-green-800'
                            : result.estado === 'ARCHIVADO'
                            ? 'bg-gray-100 text-gray-800'
                            : result.estado === 'SENTENCIA'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {result.estado}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-secondary-500">Actor</p>
                          <p className="text-secondary-900 font-medium">{result.actor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary-500">Demandado</p>
                          <p className="text-secondary-900 font-medium">{result.demandado}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-secondary-500">Fecha</p>
                          <p className="text-secondary-900">{new Date(result.fecha).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary-500">Judicatura</p>
                          <p className="text-secondary-900">{result.judicatura}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => window.open(`https://consultas.funcionjudicial.gob.ec/informacionjudicial/public/informacion.jsf?causa=${result.id}`, '_blank')}
                        >
                          Ver detalles completos
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            
            <div className="md:w-1/3">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Búsquedas Recientes
                </h3>
                
                {recentSearches.length > 0 ? (
                  <div className="space-y-3">
                    {recentSearches.map((search, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-secondary-50 rounded-lg cursor-pointer hover:bg-secondary-100 transition-colors"
                        onClick={() => handleUseRecentSearch(search)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-secondary-900">
                            {search.search_value}
                          </span>
                          <span className="text-xs text-secondary-500">
                            {new Date(search.timestamp).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-secondary-600">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mr-2">
                            {searchTypes.find(t => t.id === search.search_type)?.name || search.search_type}
                          </span>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {provinces.find(p => p.id === search.province)?.name || search.province}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-500 text-center py-4">
                    No hay búsquedas recientes
                  </p>
                )}
                
                <div className="mt-6">
                  <h4 className="text-md font-medium text-secondary-900 mb-3">
                    Consejos de búsqueda
                  </h4>
                  <ul className="space-y-2 text-sm text-secondary-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Para buscar por número de causa, use el formato completo (ej. 17294-2023-00123)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Al buscar por nombre, incluya al menos un apellido completo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Seleccione la provincia correcta para obtener resultados más precisos</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessSearch;
