/**
 * CLOUDFLARE WORKER SOLUCIÓN FINAL - ABOGADO WILSON
 */

import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

// Configuración para el manejo de assets
const ASSET_CONFIG = {
  BROWSER_TTL: 60 * 60 * 24 * 365, // 1 año en segundos
  CACHE_CONTROL: {
    browserTTL: 60 * 60 * 24 * 365, // 1 año en segundos
    edgeTTL: 60 * 60 * 24 * 7, // 7 días en segundos
    bypassCache: false,
  }
};

// Headers de seguridad
const securityHeaders = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.supabase.co;",
};

addEventListener('fetch', event => {
  try {
    event.respondWith(handleRequest(event));
  } catch (e) {
    event.respondWith(new Response('Error interno en el servidor', { status: 500 }));
  }
});

async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  
  // Manejar solicitudes CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCORS(request, {
      allowedOrigins: ['*'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400, // 24 horas en segundos
    });
  }

  try {
    // Para peticiones a la API
    if (url.pathname.startsWith('/api/')) {
      // Aquí iría la lógica para manejar las peticiones a la API
      return new Response(JSON.stringify({ error: 'API endpoint no implementado' }), {
        status: 501,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Para servir favicon
    if (url.pathname === '/favicon.ico' || url.pathname === '/favicon.svg') {
      try {
        return await getAssetFromKV(event, {
          ...ASSET_CONFIG,
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}${url.pathname}`, req),
        });
      } catch (e) {
        // Si no encontramos el favicon, enviamos uno genérico
        const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <rect width="100" height="100" rx="20" fill="#2563eb"/>
          <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
          <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
          <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
        </svg>`;
        
        return new Response(svgIcon, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400',
          },
        });
      }
    }

    // Para todos los demás recursos, intentamos servirlos desde KV
    const response = await getAssetFromKV(event, ASSET_CONFIG);
    
    // Añadir headers de seguridad y CORS
    return addHeaders(response, {
      ...securityHeaders,
      'Access-Control-Allow-Origin': '*',
    });
  } catch (e) {
    console.error(`Error al servir contenido: ${e.message}`);
    
    // Si el recurso no se encuentra y es una petición de un navegador (no de un asset)
    // servimos el index.html para manejar rutas de SPA
    if (e.status === 404 && request.headers.get('accept').includes('text/html')) {
      try {
        const notFoundResponse = await getAssetFromKV(event, {
          ...ASSET_CONFIG,
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
        });
        
        // Devolvemos el index.html pero mantenemos el status 200
        return addHeaders(notFoundResponse, {
          ...securityHeaders,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/html;charset=UTF-8',
        });
      } catch (indexError) {
        // Si tampoco podemos servir el index.html, devolvemos una página 404 personalizada
        return new Response(getNotFoundPage(), {
          status: 404,
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
    
    // Para cualquier otro error, devolvemos una página personalizada
    return new Response(getErrorPage(), {
      status: e.status || 500,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

/**
 * Maneja solicitudes CORS
 */
function handleCORS(request, corsConfig) {
  const headers = new Headers({
    'Access-Control-Allow-Origin': corsConfig.allowedOrigins.includes(request.headers.get('Origin'))
      ? request.headers.get('Origin')
      : corsConfig.allowedOrigins[0],
    'Access-Control-Allow-Methods': corsConfig.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(', '),
    'Access-Control-Max-Age': corsConfig.maxAge.toString(),
  });

  return new Response(null, { status: 204, headers });
}

/**
 * Añade headers a una respuesta
 */
function addHeaders(response, headers) {
  const newResponse = new Response(response.body, response);
  
  Object.entries(headers).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });
  
  return newResponse;
}

/**
 * Página para error 404
 */
function getNotFoundPage() {
  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Abogado Wilson - Página no encontrada</title>
    <style>
      :root {
        --primary: #2563eb;
        --primary-dark: #1e40af;
        --text: #1f2937;
        --background: #f9fafb;
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: system-ui, -apple-system, sans-serif;
      }
      body {
        background-color: var(--background);
        color: var(--text);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }
      .error-container {
        max-width: 600px;
        text-align: center;
        background: white;
        padding: 3rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      h1 {
        color: var(--primary);
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      p {
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        background-color: var(--primary);
        color: white;
        font-weight: 500;
        padding: 0.75rem 1.5rem;
        border-radius: 0.375rem;
        text-decoration: none;
        transition: background-color 0.2s;
      }
      .button:hover {
        background-color: var(--primary-dark);
      }
      .logo {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="error-container">
      <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#2563eb"/>
        <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
        <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
        <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
      </svg>
      <h1>Página no encontrada</h1>
      <p>Lo sentimos, no pudimos encontrar la página que estás buscando. Por favor, utiliza el botón para volver a la página principal.</p>
      <a href="/" class="button">Volver al inicio</a>
    </div>
  </body>
  </html>`;
}

/**
 * Página para error 500
 */
function getErrorPage() {
  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Abogado Wilson - Error del servidor</title>
    <style>
      :root {
        --primary: #2563eb;
        --primary-dark: #1e40af;
        --text: #1f2937;
        --background: #f9fafb;
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: system-ui, -apple-system, sans-serif;
      }
      body {
        background-color: var(--background);
        color: var(--text);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }
      .error-container {
        max-width: 600px;
        text-align: center;
        background: white;
        padding: 3rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      h1 {
        color: var(--primary);
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      p {
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        background-color: var(--primary);
        color: white;
        font-weight: 500;
        padding: 0.75rem 1.5rem;
        border-radius: 0.375rem;
        text-decoration: none;
        transition: background-color 0.2s;
      }
      .button:hover {
        background-color: var(--primary-dark);
      }
      .logo {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="error-container">
      <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#2563eb"/>
        <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
        <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
        <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
      </svg>
      <h1>Error temporal del servidor</h1>
      <p>Estamos experimentando dificultades técnicas. Por favor, intente nuevamente más tarde o contacte a soporte si el problema persiste.</p>
      <button onclick="window.location.reload()" class="button">Recargar página</button>
    </div>
  </body>
  </html>`;
}
