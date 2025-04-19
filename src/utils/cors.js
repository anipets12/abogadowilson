/**
 * Configuraciu00f3n de CORS para el proyecto
 */

// Cabeceras CORS comunes para todas las respuestas
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/**
 * Maneja solicitudes preflight OPTIONS
 */
export async function handleOptions(request) {
  return new Response(null, {
    headers: {
      ...corsHeaders,
      'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  });
}

/**
 * Genera respuesta con error con cabeceras CORS adecuadas
 */
export function errorResponse(message, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    }
  );
}

/**
 * Genera respuesta exitosa con cabeceras CORS adecuadas
 */
export function successResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    }
  );
}
