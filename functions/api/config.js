/**
 * config.js - Endpoint de configuración optimizado para Cloudflare Workers
 * 
 * Este archivo se encarga de servir variables de configuración seguras al cliente
 * con manejo apropiado de CORS y seguridad para Cloudflare Workers.
 */

export async function onRequest(context) {
  // Configurar encabezados CORS explícitos para evitar problemas de acceso
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*', // Permitir desde cualquier origen
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info'
  };
  
  // Manejar solicitudes preflight OPTIONS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Obtener variables de entorno en formato compatible con Workers
  const env = context.env || {};
  
  // Crear objeto de configuración con valores predeterminados robustos
  const clientConfig = {
    // Claves de API y configuración con valores por defecto
    VITE_SUPABASE_URL: 'https://phzldiaohelbyobhjrnc.supabase.co',
    VITE_SUPABASE_KEY: 'sbp_db5898ecc094d37ec87562399efe3833e63ab20f',
    VITE_GOOGLE_GENERATIVE_API_KEY: env.GOOGLE_GENERATIVE_API_KEY || 'AIzaSyB9ENQXVErbIQ166m7dGwndOB6hlFj9k5I',
    VITE_GOOGLE_API_KEY_ALTERNATIVE: env.GOOGLE_API_KEY_ALTERNATIVE || 'AIzaSyBCKTfeo2P92rCk_mhrz7J73pNY4zDMBh0',
    VITE_GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID || '387170916829-t6dp4kb7cp663ihq98as0jjju9n0ljbm.apps.googleusercontent.com',
    VITE_GOOGLE_SERVICE_ACCOUNT: env.GOOGLE_SERVICE_ACCOUNT || 'pruebagoogle@gen-lang-client-0663345747.iam.gserviceaccount.com',
    // Flag para indicar que esta configuración fue cargada correctamente
    CONFIG_LOADED: true,
    CONFIG_VERSION: '2.0.1',
    CONFIG_TIMESTAMP: new Date().toISOString()
  };
  
  try {
    // Logging para diagnóstico
    console.log('Endpoint de configuración accedido correctamente');
    
    // Devolver la configuración como JSON con encabezados CORS apropiados
    return new Response(JSON.stringify(clientConfig), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error en endpoint de configuración:', error);
    
    // Devolver respuesta con valores predeterminados en caso de error
    return new Response(JSON.stringify({
      ...clientConfig,
      CONFIG_ERROR: error.message,
      CONFIG_FALLBACK: true
    }), {
      headers: corsHeaders,
      status: 200, // Devolver 200 en lugar de 500 para evitar bloqueo de cliente
    });
  }
}
