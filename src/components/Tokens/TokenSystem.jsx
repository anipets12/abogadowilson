import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCoins, FaRedo, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const TokenSystem = () => {
  const { user, tokens, useToken: useUserToken, refillTokens: refillUserTokens } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const { success } = await useUserToken();
      
      if (success) {
        toast.success('Token utilizado correctamente');
      }
    } catch (error) {
      toast.error('Error al usar el token');
      console.error('Error using token:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = async () => {
    setLoading(true);
    try {
      await refillUserTokens();
    } catch (error) {
      toast.error('Error al recargar los tokens');
      console.error('Error reloading tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-6">
          <FaInfoCircle className="text-blue-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Sistema de Tokens</h3>
          <p className="text-gray-600 mb-4">
            Inicie sesión para gestionar sus tokens de consulta
          </p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">Sistema de Tokens</h3>
          <p className="text-gray-600">
            Utilice sus tokens para realizar consultas y generar documentos
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="bg-blue-50 text-blue-700 rounded-full px-4 py-2 flex items-center">
            <FaCoins className="text-yellow-500 mr-2" />
            <span className="font-semibold">{tokens} tokens disponibles</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 mb-2">
          <FaInfoCircle className="inline-block mr-1 text-blue-500" />
          <strong>¿Cómo funciona?</strong>
        </p>
        <p className="text-sm text-gray-600">
          Cada consulta o generación de documento consume 1 token. Tiene un límite de 3 tokens que puede recargar cuando se agoten.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleQuery}
          disabled={loading || tokens <= 0}
          className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="mr-2">Procesando...</span>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </>
          ) : (
            'Realizar Consulta'
          )}
        </button>
        
        <button
          onClick={handleReload}
          disabled={loading || tokens >= 3}
          className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="mr-2">Procesando...</span>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </>
          ) : (
            <>
              <FaRedo className="mr-2" /> Recargar Tokens
            </>
          )}
        </button>
      </div>
      
      {tokens <= 0 && (
        <div className="mt-4 text-center text-sm text-red-500">
          No tiene tokens disponibles. Por favor recargue para poder realizar consultas.
        </div>
      )}
      
      {tokens >= 3 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Ya tiene el máximo de tokens disponibles (3).
        </div>
      )}
    </div>
  );
};

export default TokenSystem;
