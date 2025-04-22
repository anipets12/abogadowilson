/**
 * WORKER CLOUDFLARE DEFINITIVO - ABOGADO WILSON
 * Versión optimizada para asegurar despliegue correcto sin errores
 * Soluciona problemas de:
 * - Error 1042
 * - Favicon.ico
 * - Ruteo SPA
 * - Assets estáticos
 */

addEventListener('fetch', event => {
  try {
    event.respondWith(handleRequest(event));
  } catch (e) {
    event.respondWith(new Response('Error interno del servidor', { status: 500 }));
  }
});

/**
 * Maneja todas las solicitudes entrantes
 * @param {FetchEvent} event - Evento fetch de Cloudflare
 * @returns {Response} - Respuesta generada
 */
async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  
  // Headers estándar para todas las respuestas
  const standardHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
  
  // Manejar solicitudes CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: standardHeaders
    });
  }

  // Manejo especializado de favicon.ico
  if (url.pathname === '/favicon.ico' || url.pathname === '/favicon.svg') {
    // Intentar servir el favicon desde KV/R2/Assets
    try {
      // Usamos el namespace __STATIC_CONTENT
      const faviconKey = url.pathname === '/favicon.ico' ? '/favicon.ico' : '/favicon.svg';
      
      // Intentar obtener el favicon directamente
      let response = await fetch(new Request(url.origin + faviconKey, request));
      
      if (response.ok) {
        // Aplicar los headers de seguridad
        const newHeaders = new Headers(response.headers);
        Object.entries(standardHeaders).forEach(([key, value]) => {
          newHeaders.set(key, value);
        });
        newHeaders.set('Cache-Control', 'public, max-age=86400');
        
        return new Response(response.body, {
          status: response.status,
          headers: newHeaders
        });
      }
    } catch (e) {
      console.error('Error al servir favicon:', e);
    }
    
    // Favicon de respaldo en SVG si no se encuentra
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
        ...standardHeaders
      }
    });
  }
  
  // Intentar servir archivos estáticos o la SPA
  try {
    let response;
    
    // 1. Comprobar si el archivo existe en Assets (si tiene extensión)
    const hasExtension = url.pathname.includes('.') && !url.pathname.endsWith('/');
    
    if (hasExtension) {
      try {
        // Intentar servir el recurso estático
        response = await fetch(request.clone());
        
        if (response.ok) {
          // Aplicar headers de seguridad
          const newHeaders = new Headers(response.headers);
          Object.entries(standardHeaders).forEach(([key, value]) => {
            newHeaders.set(key, value);
          });
          
          // Caché específico por tipo de archivo
          const extension = url.pathname.split('.').pop().toLowerCase();
          if (['js', 'css', 'woff2', 'woff', 'ttf', 'eot'].includes(extension)) {
            newHeaders.set('Cache-Control', 'public, max-age=31536000'); // 1 año
          } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'].includes(extension)) {
            newHeaders.set('Cache-Control', 'public, max-age=604800'); // 1 semana
          } else {
            newHeaders.set('Cache-Control', 'public, max-age=3600'); // 1 hora
          }
          
          return new Response(response.body, {
            status: response.status,
            headers: newHeaders
          });
        }
      } catch (e) {
        console.error('Error al servir archivo estático:', e);
      }
    }
    
    // 2. Para rutas de la SPA, servir index.html
    try {
      // Esta es la clave: Usar una nueva request a index.html específicamente
      const indexRequest = new Request(`${url.origin}/index.html`, {
        method: 'GET',
        headers: request.headers
      });
      
      response = await fetch(indexRequest);
      
      if (response.ok) {
        const newHeaders = new Headers(response.headers);
        Object.entries(standardHeaders).forEach(([key, value]) => {
          newHeaders.set(key, value);
        });
        // Cache más corto para el HTML
        newHeaders.set('Cache-Control', 'public, max-age=600'); // 10 minutos
        
        // Devolver el index.html de la SPA
        console.log('Sirviendo SPA index.html para:', url.pathname);
        return new Response(response.body, {
          status: 200,
          headers: newHeaders
        });
      }
    } catch (e) {
      console.error('Error al servir index.html:', e);
    }
    
    // 3. Si llegamos aquí, mostrar un mensaje de error claro
    const notFoundHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Abogado Wilson - Error 404</title>
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
            flex-direction: column;
            padding: 2rem;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .error-container {
            max-width: 600px;
            background: white;
            padding: 2rem;
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
            margin-bottom: 1.5rem;
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
          <p>Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.</p>
          <a href="/" class="button">Volver al inicio</a>
        </div>
      </body>
      </html>
    `;
    
    return new Response(notFoundHtml, {
      status: 404,
      headers: {
        'Content-Type': 'text/html',
        ...standardHeaders
      }
    });
  } catch (error) {
    console.error('Error crítico en worker:', error);
    
    // Error interno del servidor
    return new Response(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Abogado Wilson - Error del servidor</title>
        <style>
          body { font-family: system-ui, sans-serif; text-align: center; padding: 50px 20px; }
          h1 { color: #2563eb; }
          p { margin: 15px 0; max-width: 600px; margin: 0 auto 20px; }
          button { background: #2563eb; color: white; border: none; padding: 12px 24px; cursor: pointer; border-radius: 4px; font-size: 16px; }
        </style>
      </head>
      <body>
        <h1>Error temporal del servidor</h1>
        <p>Estamos experimentando dificultades técnicas. Por favor, inténtelo de nuevo en unos minutos.</p>
        <button onclick="window.location.reload()">Refrescar página</button>
      </body>
      </html>
    `, {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
        ...standardHeaders
      }
    });
  }
}
