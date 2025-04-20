import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Página no encontrada | Abogado Wilson Ipiales</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mt-8">
            <div className="text-6xl font-extrabold text-red-600">404</div>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Página no encontrada
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              La página que estás buscando no existe o ha sido movida.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Volver a inicio
              </Link>
              <Link 
                to="/servicios" 
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Ver servicios
              </Link>
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-500">
                ¿Necesitas asistencia legal inmediata? 
                <Link to="/contacto" className="text-blue-600 hover:text-blue-800 font-medium">
                  Contáctanos
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
