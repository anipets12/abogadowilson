import React from 'react';
import { Link } from 'react-router-dom';
import ConsultasBase from './ConsultasBase';

const ConsultasTransito = () => {
  return (
    <ConsultasBase queryType="transito">
      {({ handleQuery, queryCount, isLoading }) => (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Consultas de Tránsito</h2>
          
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
            <h3 className="text-xl font-semibold mb-4">Soluciones para Multas y Citaciones</h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-yellow-600 pl-4">
                <h4 className="font-medium text-lg">Multas por Exceso de Velocidad</h4>
                <p className="text-gray-600 mt-2">
                  Las multas por exceso de velocidad pueden tener graves consecuencias:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Sanciones económicas elevadas</li>
                  <li>Pérdida de puntos en la licencia</li>
                  <li>Posible suspensión temporal del permiso de conducir</li>
                </ul>
                <p className="text-gray-600 mt-2">Te ayudamos con:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Verificación de procedimientos y equipos de radar</li>
                  <li>Impugnación basada en errores de procedimiento</li>
                  <li>Negociación para reducir la sanciones</li>
                </ul>
                <button 
                  onClick={handleQuery}
                  disabled={queryCount >= 5}
                  className="mt-4 inline-block bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consultar sobre mi multa
                </button>
              </div>

              <div className="border-l-4 border-orange-600 pl-4">
                <h4 className="font-medium text-lg">Citaciones por Infracciones</h4>
                <p className="text-gray-600 mt-2">
                  Las citaciones por estacionamiento, semáforos o infracciones menores pueden acumularse:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Generación de intereses por pagos atrasados</li>
                  <li>Bloqueo de trámites administrativos</li>
                  <li>Impedimento para renovar documentos</li>
                </ul>
                <p className="text-gray-600 mt-2">Nuestras soluciones:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Revisión del estado actual de las citaciones</li>
                  <li>Planeación de pagos o impugnaciones</li>
                  <li>Representación legal ante autoridades de tránsito</li>
                </ul>
                <button 
                  onClick={handleQuery}
                  disabled={queryCount >= 5}
                  className="mt-4 inline-block bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verificar mis citaciones
                </button>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <h4 className="font-medium text-lg">Estado de Licencia y Puntos</h4>
                <p className="text-gray-600 mt-2">
                  Problemas relacionados con licencias de conducir pueden generar:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Inhabilitación para conducir vehículos</li>
                  <li>Complicaciones legales por conducir sin licencia válida</li>
                  <li>Dificultades para contratación en ciertos empleos</li>
                </ul>
                <p className="text-gray-600 mt-2">Te asistimos con:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Verificación de estado actual de la licencia</li>
                  <li>Procedimientos de recuperación de puntos</li>
                  <li>Gestión para renovaciones y trámites especiales</li>
                </ul>
                <button 
                  onClick={handleQuery}
                  disabled={queryCount >= 5}
                  className="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consultar mi licencia
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-lg text-blue-800">¿Necesitas consultas ilimitadas?</h4>
                <p className="text-gray-700 mt-2">
                  Únete a nuestro programa de afiliados y obtén beneficios exclusivos:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Consultas ilimitadas sobre temas de tránsito</li>
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

export default ConsultasTransito;
