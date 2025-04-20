// Worker para servir activos estáticos y manejar enrutamiento SPA

import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

const DEBUG = false;

export default {
  async fetch(request, env, ctx) {
    try {
      return await handleEvent(request, env, ctx);
    } catch (e) {
      if (DEBUG) {
        return new Response(e.message || e.toString(), {
          status: 500,
        });
      }
      return new Response('Internal Error', { status: 500 });
    }
  }
};

async function handleEvent(request, env, ctx) {
  const url = new URL(request.url);
  
  // Manejar solicitudes CORS OPTIONS
  if (request.method === 'OPTIONS') {
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
    // Para las solicitudes a la API, redirigir a la función API
    if (url.pathname.startsWith('/api')) {
      return await handleApiRequest(request, url, env);
    }

    // Servir activos estáticos o la aplicación SPA
    const options = {
      // Opciones de personalización si es necesario
      mapRequestToAsset: req => {
        // Redirigir todas las navegaciones a index.html para SPA
        const parsedUrl = new URL(req.url);
        const pathname = parsedUrl.pathname;
        
        // Si la ruta no incluye una extensión, servir index.html
        if (!pathname.includes('.')) {
          return new Request(`${parsedUrl.origin}/index.html`, req);
        }
        return req;
      },
    };

    // Crear el evento para getAssetFromKV
    const event = {
      request,
      waitUntil: ctx.waitUntil.bind(ctx)
    };

    // Intentar obtener el activo estático de KV
    const page = await getAssetFromKV(event, {
      ...options,
      ASSET_NAMESPACE: env.__STATIC_CONTENT,
      ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST
    });

    // Agregar headers de seguridad
    const response = new Response(page.body, page);
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
    response.headers.set('Access-Control-Allow-Origin', '*');

    return response;
  } catch (e) {
    // Si hay un error, intentar servir index.html
    if (DEBUG) {
      return new Response(e.message || e.toString(), { status: 500 });
    }

    try {
      // Crear el evento para getAssetFromKV
      const event = {
        request,
        waitUntil: ctx.waitUntil.bind(ctx)
      };

      const notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST
      });

      return new Response(notFoundResponse.body, {
        ...notFoundResponse,
        status: 200,
        headers: {
          ...notFoundResponse.headers,
          'X-XSS-Protection': '1; mode=block',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'no-referrer-when-downgrade',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (e) {
      return new Response('Internal Error', { status: 500 });
    }
  }
}

async function handleApiRequest(request, url, env) {
  // Este es un placeholder para la lógica de la API
  return new Response(JSON.stringify({ error: 'API en construcción' }), {
    status: 501,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
