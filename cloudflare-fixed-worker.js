/**
 * CLOUDFLARE WORKER DEFINITIVO - ABOGADO WILSON
 * Solución final para el despliegue correcto de SPA en Cloudflare Workers
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  
  // Headers de seguridad estándar
  const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
  
  // Headers CORS para permitir solicitudes de diferentes orígenes
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  };
  
  // Manejar solicitudes OPTIONS para CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { ...corsHeaders }
    });
  }

  try {
    // Servir favicon.ico o favicon.svg
    if (url.pathname === '/favicon.ico' || url.pathname === '/favicon.svg') {
      return await serveFavicon(url.pathname, corsHeaders);
    }
    
    // Para archivos con extensión, intentar servirlos directamente
    if (url.pathname.includes('.') && !url.pathname.endsWith('/')) {
      const response = await fetch(request);
      if (response.ok) {
        return addHeaders(response, {
          ...corsHeaders,
          'Cache-Control': 'public, max-age=31536000'
        });
      }
    }
    
    // Para todas las demás rutas, servir el index.html (típico para SPA)
    if (url.pathname === '/' || !url.pathname.includes('.')) {
      try {
        // Obtener el index.html
        const indexUrl = new URL('/index.html', url.origin);
        console.log('Intentando servir index.html desde:', indexUrl.href);
        
        const indexResponse = await fetch(indexUrl, {
          cf: {
            cacheTtl: 10,  // Caché corto para depuración
            cacheEverything: false
          }
        });
        
        if (indexResponse.ok) {
          return addHeaders(indexResponse, {
            ...corsHeaders,
            ...securityHeaders,
            'Cache-Control': 'public, max-age=600'
          });
        }
      } catch (e) {
        console.error('Error al servir index.html:', e);
      }
    }
    
    // Si llegamos aquí, devolver una página 404 personalizada
    return new Response(getNotFoundPage(), {
      status: 404,
      headers: {
        'Content-Type': 'text/html',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error crítico en worker:', error);
    
    // Página de error del servidor
    return new Response(getErrorPage(), {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
        ...corsHeaders
      }
    });
  }
}

/**
 * Sirve el favicon
 */
async function serveFavicon(pathname, headers) {
  try {
    const faviconUrl = new URL(pathname, self.location.origin);
    const response = await fetch(faviconUrl);
    
    if (response.ok) {
      return addHeaders(response, {
        ...headers,
        'Cache-Control': 'public, max-age=86400'
      });
    }
  } catch (e) {
    console.error('Error al servir favicon:', e);
  }
  
  // Favicon SVG de respaldo
  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="20" fill="#2563eb"/>
    <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
    <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
    <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
  </svg>`;
  
  return new Response(svgIcon, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
      ...headers
    }
  });
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
    <script>
      // Redireccionar a inicio después de 5 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);
    </script>
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
    <script>
      // Recargar después de 10 segundos
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    </script>
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
      <p>Estamos experimentando dificultades técnicas. La página se recargará automáticamente en unos segundos, o puede intentarlo manualmente con el botón a continuación.</p>
      <button onclick="window.location.reload()" class="button">Recargar página</button>
    </div>
  </body>
  </html>`;
}
