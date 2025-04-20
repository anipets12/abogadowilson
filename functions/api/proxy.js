// Proxy para resolver problemas CORS con Supabase en Cloudflare Workers
export async function onRequest(context) {
  const request = context.request;
  
  // Manejar preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  // Solo permitir POST para el proxy
  if (request.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 });
  }
  
  try {
    const requestData = await request.json();
    const { url, method, headers, body } = requestData;
    
    // Verificar que la URL es de Supabase o API autorizada
    if (!url.includes('supabase.co') && !url.includes('api.supabase.com')) {
      return new Response('URL no permitida', { status: 403 });
    }
    
    // Configurar la solicitud proxy
    const fetchOptions = {
      method: method || 'GET',
      headers: headers || {},
    };
    
    // Asegurar que tenemos headers correctos
    if (!fetchOptions.headers['Content-Type'] && method !== 'GET') {
      fetchOptions.headers['Content-Type'] = 'application/json';
    }
    
    // Agregar el body si existe
    if (body) {
      if (typeof body === 'object') {
        fetchOptions.body = JSON.stringify(body);
      } else {
        fetchOptions.body = body;
      }
    }
    
    // Realizar la solicitud
    const response = await fetch(url, fetchOptions);
    
    // Leer el body como texto para determinar si es JSON o no
    const responseText = await response.text();
    let responseData;
    
    try {
      // Intentar parsear como JSON
      responseData = JSON.parse(responseText);
      
      // Devolver la respuesta como JSON
      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    } catch (e) {
      // Si no es JSON, devolver como texto
      return new Response(responseText, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }
  } catch (error) {
    console.error('Error en proxy:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
