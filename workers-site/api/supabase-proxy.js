// Proxy para manejar solicitudes a Supabase y evitar errores CORS
import { supabaseConfig } from '../../src/config/appConfig';

// URL base de Supabase
const SUPABASE_URL = supabaseConfig.url;
const SUPABASE_KEY = supabaseConfig.key;

/**
 * Maneja todas las solicitudes proxy a Supabase
 * @param {Request} request - La solicitud original
 * @param {string} path - La ruta de Supabase a la que acceder
 * @returns {Promise<Response>} - La respuesta de Supabase con encabezados CORS
 */
export async function handleSupabaseProxy(request, path) {
  try {
    // Construir la URL completa de Supabase
    const supabaseUrl = `${SUPABASE_URL}${path}`;
    
    // Crear una nueva solicitud para Supabase
    const supabaseRequest = new Request(supabaseUrl, {
      method: request.method,
      headers: getModifiedHeaders(request.headers),
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : undefined,
      redirect: 'follow'
    });
    
    // Realizar la solicitud a Supabase
    const supabaseResponse = await fetch(supabaseRequest);
    
    // Crear una nueva respuesta con los encabezados CORS adecuados
    const response = new Response(supabaseResponse.body, {
      status: supabaseResponse.status,
      statusText: supabaseResponse.statusText,
      headers: addCorsHeaders(supabaseResponse.headers)
    });
    
    return response;
  } catch (error) {
    console.error('Error en el proxy de Supabase:', error);
    
    // Devolver una respuesta de error con encabezados CORS
    return new Response(JSON.stringify({ 
      error: 'Error al comunicarse con Supabase', 
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      }
    });
  }
}

/**
 * Verifica la conexión con Supabase
 * @returns {Promise<Response>} Respuesta con el estado de la conexión
 */
export async function checkSupabaseConnection() {
  try {
    // Intentar una solicitud simple a Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?count=exact&head=true`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = {
      connected: response.ok,
      status: response.status,
      message: response.ok ? 'Conexión exitosa a Supabase' : 'Error al conectar con Supabase'
    };
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      connected: false, 
      error: error.message 
    }), {
      status: 200, // Devolvemos 200 pero con estado de conexión false
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    });
  }
}

/**
 * Modifica los encabezados para la solicitud a Supabase
 * @param {Headers} headers Encabezados originales
 * @returns {Headers} Encabezados modificados
 */
function getModifiedHeaders(headers) {
  const newHeaders = new Headers(headers);
  
  // Asegurarnos de que los encabezados de autorización estén presentes
  if (!newHeaders.has('apikey')) {
    newHeaders.set('apikey', SUPABASE_KEY);
  }
  
  if (!newHeaders.has('Authorization')) {
    newHeaders.set('Authorization', `Bearer ${SUPABASE_KEY}`);
  }
  
  // Eliminar encabezados que podrían causar problemas
  newHeaders.delete('host');
  
  return newHeaders;
}

/**
 * Añade encabezados CORS a la respuesta
 * @param {Headers} headers Encabezados originales
 * @returns {Headers} Encabezados con CORS
 */
function addCorsHeaders(headers) {
  const corsHeaders = new Headers(headers);
  
  corsHeaders.set('Access-Control-Allow-Origin', '*');
  corsHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  corsHeaders.set('Access-Control-Allow-Headers', '*');
  corsHeaders.set('Access-Control-Max-Age', '86400');
  
  return corsHeaders;
}
