import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

const DEBUG = false;

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      );
    }
    event.respondWith(new Response('Internal Error', { status: 500 }));
  }
});

async function handleEvent(event) {
  const url = new URL(event.request.url);
  
  // Manejar solicitudes CORS OPTIONS
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    // Configurar opciones para servir activos estáticos
    const options = {
      cacheControl: {
        browserTTL: 60 * 60 * 24, // 1 día
        edgeTTL: 60 * 60 * 24 * 30, // 30 días
        bypassCache: false,
      },
      // Esta función mapea rutas SPA a index.html
      mapRequestToAsset: req => {
        const url = new URL(req.url);
        
        // Redirigir rutas de SPA sin extensión a index.html
        if (!url.pathname.includes('.') && url.pathname !== '/') {
          console.log(`SPA route detected: ${url.pathname}, mapping to /index.html`);
          return new Request(`${url.origin}/index.html`, req);
        }
        
        return req;
      },
    };

    // Intentar obtener el activo estático de KV
    const page = await getAssetFromKV(event, options);

    // Agregar headers de seguridad
    const response = new Response(page.body, page);
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    return response;
  } catch (e) {
    console.error(`Error serving asset: ${e.message}`);
    
    // Si es una ruta SPA, intentar servir index.html
    if (!url.pathname.includes('.')) {
      try {
        const indexRequest = new Request(`${url.origin}/index.html`, event.request);
        const indexPage = await getAssetFromKV(
          { request: indexRequest, waitUntil: event.waitUntil.bind(event) },
          options
        );
        
        // Agregar headers de seguridad
        const response = new Response(indexPage.body, {
          headers: indexPage.headers,
          status: 200,
        });
        response.headers.set('X-XSS-Protection', '1; mode=block');
        
        return response;
      } catch (indexError) {
        console.error(`Error serving index.html: ${indexError.message}`);
      }
    }
    
    return new Response('Archivo no encontrado', { status: 404 });
  }
}
