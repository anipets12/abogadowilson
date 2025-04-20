// Endpoint de API seguro para servir la configuración al cliente
export async function onRequest(context) {
  // Definir encabezados CORS
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info'
  });

  // Para preflight OPTIONS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Obtener variables de entorno desde el worker o variables de entorno específicas del despliegue
  const env = context.env || {};
  
  // Crear objeto de configuración segura para el cliente
  // Solo incluir las claves específicas que necesitamos exponer al cliente
  const clientConfig = {
    VITE_GOOGLE_GENERATIVE_API_KEY: env.GOOGLE_GENERATIVE_API_KEY || 'AIzaSyB9ENQXVErbIQ166m7dGwndOB6hlFj9k5I',
    VITE_GOOGLE_API_KEY_ALTERNATIVE: env.GOOGLE_API_KEY_ALTERNATIVE || 'AIzaSyBCKTfeo2P92rCk_mhrz7J73pNY4zDMBh0',
    VITE_GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID || '387170916829-t6dp4kb7cp663ihq98as0jjju9n0ljbm.apps.googleusercontent.com',
    // El secreto de cliente solo debe usarse en el backend, nunca expuesto al frontend
    VITE_GOOGLE_SERVICE_ACCOUNT: env.GOOGLE_SERVICE_ACCOUNT || 'pruebagoogle@gen-lang-client-0663345747.iam.gserviceaccount.com',
  };
  
  // Devolver la configuración como JSON
  return new Response(JSON.stringify(clientConfig), {
    headers,
    status: 200,
  });
}
