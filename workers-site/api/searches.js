// API endpoint para gestionar búsquedas recientes
import { corsHeaders } from '../cors-headers';

/**
 * Maneja solicitudes para búsquedas recientes
 */
export async function handleSearches(request) {
  // Manejar preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  }

  try {
    // Para pruebas, devolver datos simulados
    const mockSearches = [
      { id: 1, query: 'Abogado penal especializado', count: 24, timestamp: new Date().toISOString() },
      { id: 2, query: 'Consulta legal gratuita', count: 18, timestamp: new Date().toISOString() },
      { id: 3, query: 'Defensa en casos de tránsito', count: 12, timestamp: new Date().toISOString() }
    ];

    return new Response(JSON.stringify({
      data: mockSearches,
      status: 'success'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error al obtener búsquedas recientes:', error);
    
    return new Response(JSON.stringify({
      message: 'Error al procesar la solicitud',
      status: 'error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
