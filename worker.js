// Worker optimizado para Cloudflare Workers con manejo avanzado de recursos estáticos
// Solución definitiva para problemas con favicon.ico y SPA

import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

// Configuración de CORS mejorada
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey',
  'Access-Control-Max-Age': '86400',
};

// Evento principal que Cloudflare invoca
addEventListener('fetch', event => {
  // Manejar solicitudes preflight OPTIONS
  if (event.request.method === 'OPTIONS') {
    event.respondWith(handleOptions(event.request));
    return;
  }
  
  event.respondWith(handleEvent(event))
})

/**
 * Maneja solicitudes OPTIONS
 */
function handleOptions(request) {
  return new Response(null, {
    headers: corsHeaders,
    status: 204
  });
}

/**
 * Maneja todas las solicitudes web con capa de recuperación avanzada
 */
async function handleEvent(event) {
  const url = new URL(event.request.url)
  console.log('Procesando solicitud para:', url.pathname);
  
  // Caso especial para favicon.ico - contenido integrado
  if (url.pathname === '/favicon.ico') {
    // Favicon SVG convertido a ICO mediante encabezados
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
      <rect width="100" height="100" rx="20" fill="#2563eb"/>
      <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
      <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
      <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
    
    return new Response(svgContent, {
      status: 200,
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=86400',
        ...corsHeaders
      }
    });
  }
  
  // Caso especial para favicon.svg
  if (url.pathname === '/favicon.svg') {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
      <rect width="100" height="100" rx="20" fill="#2563eb"/>
      <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
      <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
      <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
    
    return new Response(svgContent, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        ...corsHeaders
      }
    });
  }
  
  // Verificar si estamos en una ruta de API
  if (url.pathname.startsWith('/api/')) {
    return handleAPIRequest(event, url);
  }
  
  try {
    // Verificar si la URL tiene extensión (activo estático) o es una ruta SPA
    const hasFileExtension = url.pathname.includes('.');
    
    // Opciones para manejar rutas SPA y archivos estáticos
    const options = {
      mapRequestToAsset: req => {
        const reqUrl = new URL(req.url);
        
        // Para rutas SPA sin extensión, servir index.html
        if (!hasFileExtension && !reqUrl.pathname.startsWith('/api/')) {
          console.log('Sirviendo SPA para ruta:', reqUrl.pathname);
          return new Request(`${reqUrl.origin}/index.html`, req);
        }
        
        // Para archivos estáticos, servir directamente
        return req;
      },
      cacheControl: {
        // Optimización de caché para diferentes tipos de archivos
        byExtension: {
          js: { edgeTTL: 86400, browserTTL: 86400 },
          css: { edgeTTL: 86400, browserTTL: 86400 },
          png: { edgeTTL: 604800, browserTTL: 604800 },
          jpg: { edgeTTL: 604800, browserTTL: 604800 },
          svg: { edgeTTL: 604800, browserTTL: 604800 },
          ico: { edgeTTL: 604800, browserTTL: 604800 },
        },
      },
    };
    
    // Intenta obtener el activo desde KV
    console.log('Buscando activo para:', url.pathname);
    const page = await getAssetFromKV(event, options);
    
    // Preparar headers optimizados para la respuesta
    const headers = new Headers(page.headers);
    
    // Headers de seguridad y optimización
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
    
    // Headers CORS
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    // Devolver respuesta optimizada
    return new Response(page.body, {
      status: 200,
      headers
    });
  } catch (e) {
    console.error('Error al servir recurso:', url.pathname, e);
    
    // Intento de recuperación sirviendo index.html para cualquier error
    try {
      console.log('Intentando fallback a SPA index.html');
      const notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req)
      });
      
      const responseHeaders = new Headers(notFoundResponse.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });
      
      return new Response(notFoundResponse.body, {
        status: 200,
        headers: responseHeaders
      });
    } catch (fallbackError) {
      console.error('Error al servir fallback SPA:', fallbackError);
      
      // Respuesta de último recurso - HTML básico
      return new Response(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Abogado Wilson</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #2563eb; }
            p { margin: 20px 0; }
            button { background: #2563eb; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; }
          </style>
          <script>
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          </script>
        </head>
        <body>
          <h1>Abogado Wilson</h1>
          <p>Redirigiendo a la página principal...</p>
          <button onclick="window.location.href='/'">Ir ahora</button>
        </body>
        </html>
      `, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders
        }
      });
    }
  }
}

/**
 * Maneja endpoints para API desde el worker
 */
async function handleAPIRequest(event, url) {
  // Configuración endpoint
  if (url.pathname.startsWith('/api/config')) {
    // Configuración básica para la aplicación
    const config = {
      VITE_SUPABASE_URL: 'https://phzldiaohelbyobhjrnc.supabase.co',
      VITE_SUPABASE_KEY: 'sbp_db5898ecc094d37ec87562399efe3833e63ab20f',
      VITE_GOOGLE_GENERATIVE_API_KEY: 'AIzaSyB9ENQXVErbIQ166m7dGwndOB6hlFj9k5I',
      VITE_GOOGLE_API_KEY_ALTERNATIVE: 'AIzaSyBCKTfeo2P92rCk_mhrz7J73pNY4zDMBh0',
      VITE_GOOGLE_CLIENT_ID: '387170916829-t6dp4kb7cp663ihq98as0jjju9n0ljbm.apps.googleusercontent.com',
      VITE_GOOGLE_SERVICE_ACCOUNT: 'pruebagoogle@gen-lang-client-0663345747.iam.gserviceaccount.com',
      CONFIG_LOADED: true,
      CONFIG_VERSION: '2.0.1',
      CONFIG_SOURCE: 'cloudflare-direct',
      CONFIG_TIMESTAMP: new Date().toISOString()
    };

    return new Response(JSON.stringify(config), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        ...corsHeaders
      },
      status: 200
    });
  }

  // Proxy para evitar problemas CORS
  if (url.pathname.startsWith('/api/proxy')) {
    const request = event.request;
    const targetUrl = new URL(request.url).searchParams.get('url');
    
    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'URL de destino no proporcionada' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    try {
      const proxyResponse = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text()
      });
      
      const responseHeaders = new Headers();
      proxyResponse.headers.forEach((value, key) => {
        responseHeaders.set(key, value);
      });
      
      // Añadir encabezados CORS
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });
      
      return new Response(proxyResponse.body, {
        status: proxyResponse.status,
        headers: responseHeaders
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }

  // Para cualquier otra ruta API no manejada
  return new Response(JSON.stringify({ error: 'Ruta API no encontrada' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}
