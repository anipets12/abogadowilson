/**
 * Configuración de CORS para Cloudflare Workers
 * Este archivo proporciona una configuración adecuada para manejar CORS
 * y permitir comunicaciones entre dominios, especialmente con Supabase
 */

// Dominios permitidos para CORS
const allowedOrigins = [
  'https://abogado-wilson.anipets12.workers.dev',
  'https://svzdqpaqtghtgnbmojxl.supabase.co',
  'https://phzldiaohelbyobhjrnc.supabase.co',
  'https://pedbyeekyumrocgbozzp.supabase.co',
  'https://supabase.co',
  'https://supabase.io',
  'https://googleapis.com',
  'https://google.com',
  'https://openrouter.ai',
  'http://localhost:3000',
  'http://localhost:8787',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8787'
];

/**
 * Verifica si el origen está permitido
 * @param {string} origin - Origen de la solicitud
 * @returns {boolean} - Si el origen está permitido
 */
function isOriginAllowed(origin) {
  if (!origin) return true; // Sin origen, permitir (ej: navegador local)
  
  return allowedOrigins.some(allowedOrigin => {
    // Verificar origen exacto
    if (allowedOrigin === origin) return true;
    
    // Verificar subdominios
    if (allowedOrigin.startsWith('https://') && origin.endsWith(allowedOrigin.substring(8))) return true;
    
    return false;
  });
}

/**
 * Agrega los encabezados CORS adecuados a una respuesta
 * @param {Request} request - Solicitud original
 * @param {Response} response - Respuesta a modificar
 * @returns {Response} - Respuesta con encabezados CORS
 */
function addCorsHeaders(request, response) {
  const origin = request.headers.get('Origin');
  const headers = new Headers(response.headers);
  
  // Establecer origen permitido
  if (origin && isOriginAllowed(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  } else {
    headers.set('Access-Control-Allow-Origin', '*');
  }
  
  // Métodos HTTP permitidos
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  // Encabezados permitidos
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Client-Info, apikey, x-api-key, Range, Content-Range, X-CSRF-Token, client-library-version, client-platform, client-version, referer, X-Supabase-Auth');
  
  // Permitir credenciales (cookies, auth)
  headers.set('Access-Control-Allow-Credentials', 'true');
  
  // Tiempo de caché para preflight
  headers.set('Access-Control-Max-Age', '86400');
  
  // Exponer encabezados específicos al código JavaScript
  headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Content-Type, X-Supabase-Auth-Token');
  
  // Permitir solicitudes desde <script> y WebAssembly
  headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Política de referencia
  headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
  
  // Seguridad de transporte estricta
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

/**
 * Crea una respuesta para solicitudes OPTIONS (preflight)
 * @param {Request} request - Solicitud original
 * @returns {Response} - Respuesta para solicitud preflight
 */
function handleOptions(request) {
  const headers = new Headers();
  const origin = request.headers.get('Origin');
  
  // Establecer origen permitido
  if (origin && isOriginAllowed(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  } else {
    headers.set('Access-Control-Allow-Origin', '*');
  }
  
  // Métodos HTTP permitidos
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  // Encabezados permitidos
  const requestHeaders = request.headers.get('Access-Control-Request-Headers');
  if (requestHeaders) {
    headers.set('Access-Control-Allow-Headers', requestHeaders);
  } else {
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Client-Info, apikey, x-api-key, Range, Content-Range, X-CSRF-Token, client-library-version, client-platform, client-version, referer, X-Supabase-Auth');
  }
  
  // Permitir credenciales (cookies, auth)
  headers.set('Access-Control-Allow-Credentials', 'true');
  
  // Tiempo de caché para preflight
  headers.set('Access-Control-Max-Age', '86400');
  
  // Devolver respuesta vacía 204 (éxito, sin contenido)
  return new Response(null, {
    status: 204,
    headers
  });
}

// Cabeceras CORS básicas para reutilizar en respuestas
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey, x-api-key, Range, Content-Range, X-CSRF-Token',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

export { addCorsHeaders, handleOptions, isOriginAllowed, corsHeaders };
