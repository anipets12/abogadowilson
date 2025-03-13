import React from 'react';
import ConsultasBase from './ConsultasBase';

const ConsultasPenales = () => {
  return (
    <ConsultasBase queryType="penal">
      {({ handleQuery, queryCount, isLoading }) => (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Consultas Penales</h2>
          
          {!isLoading && (
            <div className="mb-6">
              <p className="text-gray-600">
                Consultas restantes este mes: {5 - queryCount}
              </p>
              {queryCount >= 5 && (
                <p className="text-red-600 font-medium mt-2">
                  Has alcanzado el límite de consultas. ¡Afíliate para consultas ilimitadas!
                </p>
              )}
            </div>
          )}

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Solución de Causas Penales</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="font-medium text-lg">Delitos contra la Propiedad</h4>
                <div className="text-gray-600 mt-2">
                  <p>Si has sido víctima de robo o hurto, te ayudamos a:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Presentar la denuncia formal</li>
                    <li>Seguimiento del caso</li>
                    <li>Recuperación de bienes</li>
                  </ul>
                </div>
                <button 
                  onClick={handleQuery}
                  disabled={queryCount >= 5}
                  className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Iniciar Consulta
                </button>
              </div>

              <div className="border-l-4 border-red-600 pl-4">
                <h4 className="font-medium text-lg">Delitos contra las Personas</h4>
                <div className="text-gray-600 mt-2">
                  <p>Para casos de agresión, violencia o amenazas:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Asesoría legal especializada</li>
                    <li>Medidas de protección</li>
                    <li>Seguimiento del proceso penal</li>
                  </ul>
                </div>
                <button 
                  onClick={handleQuery}
                  disabled={queryCount >= 5}
                  className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Solicitar Ayuda
                </button>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <h4 className="font-medium text-lg">Delitos contra la Seguridad Pública</h4>
                <div className="text-gray-600 mt-2">
                  <p>Para casos de tráfico de drogas, armas u otros:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Investigación especializada</li>
                    <li>Protección de testigos</li>
                    <li>Asesoría en procesos complejos</li>
                  </ul>
                </div>
                <button 
                  onClick={handleQuery}
                  disabled={queryCount >= 5}
                  className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consultar Caso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConsultasBase>
  );
};

export default ConsultasPenales;
