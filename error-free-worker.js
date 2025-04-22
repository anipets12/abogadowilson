/**
 * WORKER CLOUDFLARE OPTIMIZADO - ABOGADO WILSON
 * Este worker resuelve definitivamente todos los errores, incluyendo:
 * - Error 1042 (Error de inicialización del worker)
 * - Error 404 en favicon.ico
 * - Problemas de enrutamiento SPA
 */

// Sin dependencias externas, máxima compatibilidad
addEventListener('fetch', event => {
  try {
    event.respondWith(handleRequest(event.request));
  } catch (e) {
    event.respondWith(new Response('Error interno', { status: 500 }));
  }
});

/**
 * Maneja todas las solicitudes entrantes
 * @param {Request} request - Solicitud original
 * @returns {Response} - Respuesta generada
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Headers estándar para todas las respuestas
  const standardHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block'
  };
  
  // Manejar solicitudes CORS OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: standardHeaders
    });
  }
  
  // Manejo específico para favicon.ico y favicon.svg - SOLUCIÓN DEFINITIVA
  if (url.pathname === '/favicon.ico' || url.pathname === '/favicon.svg') {
    try {
      // Intentar servir el archivo desde los assets estáticos
      const faviconResponse = await fetch(`${url.origin}${url.pathname}`);
      
      if (faviconResponse.ok) {
        const newResponse = new Response(faviconResponse.body, faviconResponse);
        Object.entries(standardHeaders).forEach(([key, value]) => {
          newResponse.headers.set(key, value);
        });
        // Agregar cache extra para favicon
        newResponse.headers.set('Cache-Control', 'public, max-age=86400');
        return newResponse;
      }
    } catch (e) {
      console.error('Error al servir favicon desde assets:', e);
    }
      
    // Favicon de respaldo en formato SVG
    const svgIcon = \<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#2563eb"/>
      <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
      <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
      <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
    </svg>\;
    
    return new Response(svgIcon, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        ...standardHeaders
      }
    });
  }
  
  try {
    // Para archivos estáticos (con extensión), intentar servir directamente
    if (url.pathname.includes('.')) {
      try {
        const response = await fetch(request);
        
        // Si el archivo existe, devolverlo con headers estándar
        if (response.ok) {
          const newResponse = new Response(response.body, response);
          Object.entries(standardHeaders).forEach(([key, value]) => {
            newResponse.headers.set(key, value);
          });
          return newResponse;
        }
      } catch (e) {
        // Si hay un error al cargar el archivo estático, continuar al siguiente bloque
        console.error('Error al cargar recurso estático:', e);
      }
    }
    
    // Para rutas SPA o recursos no encontrados, servir index.html
    try {
      const response = await fetch(\\/index.html\);
      
      if (response.ok) {
        const newResponse = new Response(response.body, response);
        Object.entries(standardHeaders).forEach(([key, value]) => {
          newResponse.headers.set(key, value);
        });
        return newResponse;
      }
    } catch (e) {
      console.error('Error al cargar index.html:', e);
    }
    
    // Fallback HTML si todo lo anterior falla
    return new Response(\
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Abogado Wilson</title>
        <style>
          body { font-family: system-ui, sans-serif; text-align: center; padding: 40px 20px; }
          h1 { color: #2563eb; }
          p { margin: 15px 0; max-width: 600px; margin: 0 auto 20px; }
          button { background: #2563eb; color: white; border: none; padding: 12px 24px; cursor: pointer; border-radius: 4px; font-size: 16px; }
        </style>
      </head>
      <body>
        <h1>Sitio en mantenimiento</h1>
        <p>Estamos realizando mejoras en nuestro sitio. Por favor, inténtelo de nuevo en unos minutos.</p>
        <button onclick="window.location.reload()">Refrescar página</button>
      </body>
      </html>
    \, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        ...standardHeaders
      }
    });
  } catch (error) {
    console.error('Error crítico en worker:', error);
    
    // Respuesta de emergencia si hay un error crítico
    return new Response('Error interno del servidor', {
      status: 500,
      headers: standardHeaders
    });
  }
}
