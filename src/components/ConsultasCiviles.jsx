import React from 'react';
import { Link } from 'react-router-dom';
import ConsultasBase from './ConsultasBase';

const ConsultasCiviles = () => {
  return (
    <ConsultasBase queryType="civil">
      {({ handleQuery, queryCount, isLoading }) => (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Consultas Civiles</h2>
          
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
            <h3 className="text-xl font-semibold mb-4">Soluciones para Asuntos Civiles</h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="font-medium text-lg">Contratos y Acuerdos</h4>
                <p className="text-gray-600 mt-2">
                  Los problemas con contratos pueden generar graves consecuencias:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Incumplimientos de obligaciones contractuales</li>
                  <li>Disputas sobre interpretación de cláusulas</li>
                  <li>Responsabilidades y penalizaciones</li>
                </ul>
                <p className="text-gray-600 mt-2">Te asesoramos con:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Revisión de contratos antes de firmar</li>
                  <li>Análisis de incumplimientos contractuales</li>
                  <li>Negociación y resolución de disputas</li>
                </ul>
                <button 
                  onClick={handleQuery}
                  disabled={queryCount >= 5}
                  className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consultar sobre mi contrato
                </button>
              </div>

              <div className="border-l-4 border-teal-600 pl-4">
                <h4 className="font-medium text-lg">Propiedad y Bienes Raíces</h4>
                <p className="text-gray-600 mt-2">
                  Los asuntos inmobiliarios pueden resultar en complicaciones:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Disputas sobre títulos de propiedad</li>
                  <li>Conflictos con arrendamientos</li>
                  <li>Problemas de servidumbres y linderos</li>
                </ul>
                <p className="text-gray-600 mt-2">Nuestras soluciones:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Verificación de estado legal de propiedades</li>
                  <li>Asesoría en compraventa de inmuebles</li>
                  <li>Resolución de conflictos entre propietarios</li>
                </ul>
                <button 
                  onClick={handleQuery}
                  disabled={queryCount >= 5}
                  className="mt-4 inline-block bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consultar sobre mi propiedad
                </button>
              </div>

              <div className="border-l-4 border-indigo-600 pl-4">
                <h4 className="font-medium text-lg">Herencias y Sucesiones</h4>
                <p className="text-gray-600 mt-2">
                  Las herencias pueden generar situaciones complejas:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Disputas entre herederos</li>
                  <li>Interpretación de testamentos</li>
                  <li>Procesos de sucesión intestada</li>
                </ul>
                <p className="text-gray-600 mt-2">Te asistimos con:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Orientación sobre derechos hereditarios</li>
                  <li>Elaboración y revisión de testamentos</li>
                  <li>Representación en procesos sucesorios</li>
                </ul>
                <button 
                  onClick={handleQuery}
                  disabled={queryCount >= 5}
                  className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consultar sobre herencias
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-lg text-blue-800">¿Necesitas consultas ilimitadas?</h4>
                <p className="text-gray-700 mt-2">
                  Únete a nuestro programa de afiliados y obtén beneficios exclusivos:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Consultas ilimitadas sobre asuntos civiles</li>
                  <li>Prioridad en la atención de casos</li>
                  <li>Descuentos en representación legal</li>
                </ul>
                <Link 
                  to="/afiliados"
                  className="mt-4 inline-block bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
                >
                  Conocer programa de afiliados
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConsultasBase>
  );
};

export default ConsultasCiviles;
