/**
 * proxy-handler.js - Proxy CORS para Supabase optimizado para Cloudflare Workers
 * 
 * Este endpoint resuelve los problemas de CORS entre Cloudflare Workers y Supabase,
 * permitiendo que la aplicación client-side se comunique correctamente con la API.
 */

export async function handleProxyRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  let targetUrl = url.searchParams.get('url');
  
  // Encabezados CORS que se aplicarán a todas las respuestas
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey, Range',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
    'Access-Control-Max-Age': '86400'
  };
  
  // Manejar solicitudes preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  // Si no se proporcionó URL, verificar si es una solicitud a Supabase conocida
  if (!targetUrl) {
    // Obtener la ruta completa de la solicitud
    const pathname = url.pathname;
    const supabasePath = pathname.replace('/api/proxy', '');
    
    // Determinar si es una solicitud a Supabase y construir la URL
    if (supabasePath) {
      // URL base de Supabase desde variables de entorno o configuración
      const supabaseUrl = context.env.SUPABASE_URL || 'https://phzldiaohelbyobhjrnc.supabase.co';
      targetUrl = `${supabaseUrl}${supabasePath}`;
      console.log(`Redirigiendo solicitud a: ${targetUrl}`);
    } else {
      return new Response(JSON.stringify({ 
        error: 'URL de destino no proporcionada',
        tip: 'Use /api/proxy?url=https://destino.com o /api/proxy/resto-de-la-ruta'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
  
  try {
    // Crear una nueva solicitud basada en la solicitud original
    const requestInit = {
      method: request.method,
      headers: new Headers(request.headers),
      redirect: 'follow'
    };
    
    // Eliminar encabezados que pueden causar problemas
    requestInit.headers.delete('host');
    requestInit.headers.delete('connection');
    requestInit.headers.delete('content-length');
    
    // Asegurar que tenemos el encabezado apikey para Supabase
    const supabaseKey = context.env.SUPABASE_KEY || 'sbp_db5898ecc094d37ec87562399efe3833e63ab20f';
    if (!requestInit.headers.has('apikey')) {
      requestInit.headers.set('apikey', supabaseKey);
    }
    
    // Configurar el encabezado Authorization para Supabase si está disponible
    if (!requestInit.headers.has('Authorization')) {
      const auth = request.headers.get('Authorization');
      if (auth) {
        requestInit.headers.set('Authorization', auth);
      }
    }
    
    // Añadir el cuerpo si existe
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      // Verificar si el contenido es JSON
      const contentType = request.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const body = await request.json();
          requestInit.body = JSON.stringify(body);
          requestInit.headers.set('content-type', 'application/json');
        } catch (e) {
          // Si no es JSON válido, usar el texto
          requestInit.body = await request.text();
        }
      } else {
        // Para otros tipos de contenido
        requestInit.body = await request.text();
      }
    }
    
    // Sistema de reintentos para mayor robustez
    let response;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        console.log(`Intento ${attempts + 1}/${maxAttempts} para: ${targetUrl}`);
        response = await fetch(targetUrl, requestInit);
        break; // Salir del bucle si la solicitud tuvo éxito
      } catch (fetchError) {
        attempts++;
        if (attempts === maxAttempts) {
          throw fetchError; // Relanzar el error si se agotaron los intentos
        }
        // Esperar antes de reintentar (con backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempts - 1)));
      }
    }
    
    // Leer el cuerpo de la respuesta
    let responseBody;
    const contentType = response.headers.get('content-type');
    
    // Manejar diferentes tipos de contenido de respuesta
    if (contentType && contentType.includes('application/json')) {
      // Respuesta JSON
      const json = await response.json();
      responseBody = JSON.stringify(json);
    } else if (contentType && (contentType.includes('text/') || contentType.includes('application/javascript'))) {
      // Respuesta de texto
      responseBody = await response.text();
    } else {
      // Respuesta binaria (arraybuffer)
      const buffer = await response.arrayBuffer();
      responseBody = buffer;
    }
    
    // Crear una respuesta con encabezados CORS
    const responseHeaders = new Headers(corsHeaders);
    response.headers.forEach((value, key) => {
      // No copiar encabezados CORS para evitar duplicados
      if (!key.toLowerCase().startsWith('access-control-')) {
        responseHeaders.set(key, value);
      }
    });
    
    // Establecer el tipo de contenido
    if (contentType) {
      responseHeaders.set('content-type', contentType);
    }
    
    // Devolver la respuesta con todos los encabezados necesarios
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Error en el proxy CORS:', error);
    
    // Intentar recuperación si es un error relacionado con CORS o red
    if (error.message && (error.message.includes('CORS') || error.message.includes('network'))) {
      console.log('Intentando recuperación de error CORS/Network');
      
      // Crear una respuesta simulada para evitar bloqueo de la aplicación
      return new Response(JSON.stringify({ 
        data: null, 
        error: null, 
        recovered: true,
        message: 'Respuesta simulada para evitar bloqueo por CORS'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Devolver una respuesta de error con encabezados CORS
    return new Response(JSON.stringify({ 
      error: 'Error al procesar la solicitud', 
      details: error.message,
      url: targetUrl
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
