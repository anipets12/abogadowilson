// Importamos solo lo esencial sin TypeScript para reducir posibles errores
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      // Para solicitudes de opciones (CORS)
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      // Intenta obtener el activo estático de KV
      try {
        // Verificar si es una ruta de SPA
        const url = new URL(request.url);
        const hasExtension = /\.\w+$/.test(url.pathname);
        
        // Si es una ruta sin extensión y no es la raíz, servir index.html
        if (!hasExtension && url.pathname !== '/') {
          request = new Request(`${url.origin}/index.html`, request);
        }
        
        // Obtener el activo de KV
        const asset = await getAssetFromKV(request, {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
        });
        
        // Configurar encabezados de seguridad básicos
        const response = new Response(asset.body, asset);
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.headers.set('Access-Control-Allow-Origin', '*');
        
        return response;
      } catch (e) {
        // Si falla, intentar cargar index.html
        try {
          const notFoundRequest = new Request(`${new URL(request.url).origin}/index.html`, request);
          const notFoundResponse = await getAssetFromKV(notFoundRequest, {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
          });
          
          return new Response(notFoundResponse.body, {
            status: 200,
            headers: notFoundResponse.headers,
          });
        } catch (indexError) {
          return new Response('Archivo no encontrado', { status: 404 });
        }
      }
    } catch (err) {
      // Manejador de errores general
      return new Response('Error interno del servidor', { status: 500 });
    }
  },
};
