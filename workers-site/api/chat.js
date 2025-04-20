// Endpoint para manejar las solicitudes de chat
import { generateAIResponse } from '../../src/utils/openai';

export async function handleChatRequest(request) {
  try {
    // Verificar método
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método no permitido' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // Manejar preflight OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Obtener datos del cuerpo
    const data = await request.json();
    const message = data.message;

    if (!message) {
      return new Response(JSON.stringify({ error: 'No se proporcionó mensaje' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generar respuesta con IA
    const aiResponse = await generateAIResponse(message);

    // Responder con los resultados
    return new Response(JSON.stringify({
      response: aiResponse.text,
      provider: aiResponse.provider || 'openrouter',
      status: 'success'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error en el endpoint de chat:', error);
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor', 
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
