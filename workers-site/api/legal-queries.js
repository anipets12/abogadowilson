// API endpoint para gestionar consultas legales
import { corsHeaders } from '../cors-headers';

/**
 * Maneja solicitudes para consultas legales
 */
export async function handleLegalQueries(request) {
  // Manejar preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      }
    });
  }

  try {
    if (request.method === 'GET') {
      // Para pruebas, devolver datos simulados
      const mockQueries = [
        { 
          id: 1, 
          query: '¿Qué debo hacer si me detienen en un control de tránsito?', 
          area: 'transito', 
          created_at: new Date().toISOString() 
        },
        { 
          id: 2, 
          query: '¿Cuáles son mis derechos en un proceso penal?', 
          area: 'penal', 
          created_at: new Date().toISOString() 
        },
        { 
          id: 3, 
          query: '¿Cómo puedo impugnar una multa de tránsito?', 
          area: 'transito', 
          created_at: new Date().toISOString() 
        }
      ];

      return new Response(JSON.stringify({
        data: mockQueries,
        status: 'success'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Para solicitudes POST, simular que se guarda la consulta
    if (request.method === 'POST') {
      const data = await request.json();
      
      return new Response(JSON.stringify({
        data: {
          id: Date.now(),
          ...data,
          created_at: new Date().toISOString()
        },
        status: 'success',
        message: 'Consulta guardada correctamente'
      }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Método no permitido
    return new Response(JSON.stringify({
      message: 'Método no permitido',
      status: 'error'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error al procesar consultas legales:', error);
    
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
