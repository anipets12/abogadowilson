/// <reference path="./cloudflare.d.ts" />
import { getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler'

export interface Env {
  ASSETS: KVNamespace
  CORS_ORIGIN: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Lista de rutas SPA que deben redirigir a index.html
const SPA_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/profile',
  '/dashboard',
  '/services',
  '/contact',
  '/blog',
  '/ebooks',
  '/forum',
  '/certificates',
  '/sponsorships',
  '/afiliados',
  '/appointments',
  '/auth',
  '/legal'
];

async function handleOptions(request: Request) {
  return new Response(null, {
    headers: {
      ...corsHeaders,
      'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const securityHeaders = {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co https://*.turso.io https://api.notion.com https://challenges.cloudflare.com https://*.n8n.cloud",
      ...corsHeaders
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(request)
    }

    try {
      const url = new URL(request.url);
      
      // Intentar servir el archivo estático directamente
      try {
        const options = {
          // En plan gratuito, no necesitamos especificar un manifiesto explícito
          // ASSET_MANIFEST: {},
          ASSET_NAMESPACE: env.ASSETS,
          // Agregar opciones de caching
          cacheControl: {
            browserTTL: 60 * 60 * 24, // 1 día
            edgeTTL: 60 * 60 * 24 * 30, // 30 días
            bypassCache: false,
          },
          mapRequestToAsset: req => {
            // Verificar si la ruta actual debe ser manejada por React Router
            const url = new URL(req.url);
            const { pathname } = url;
            
            const isSpaRoute = SPA_ROUTES.some(route => 
              pathname === route || pathname.startsWith(`${route}/`)
            );
            
            // También considerar rutas sin extensión que no son /api/
            const hasExtension = /\.\w+$/.test(pathname);
            const shouldServeIndexHtml = isSpaRoute || (!hasExtension && pathname !== '/');
            
            // Si es una ruta SPA, servir index.html
            if (shouldServeIndexHtml) {
              console.log(`Mapeando solicitud a index.html para ruta SPA: ${pathname}`);
              return new Request(`${url.origin}/index.html`, req);
            }
            
            return req;
          },
        };
        
        const page = await getAssetFromKV(request, options);

        // Establecer los headers de seguridad
        const response = new Response(page.body, page);
        response.headers.set('X-XSS-Protection', '1; mode=block');
        Object.entries(securityHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });

        return response;
      } catch (e) {
        console.error('Error al servir archivo estático:', e);
        
        // Intentar servir como una SPA utilizando la función especializada
        try {
          console.log('Intentando servir como SPA con serveSinglePageApp');
          const response = await serveSinglePageApp(request, {
            ASSET_NAMESPACE: env.ASSETS,
          });
          
          // Establecer los headers de seguridad
          Object.entries(securityHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
          
          return response;
        } catch (spaError) {
          console.error('Error al servir como SPA:', spaError);
        }
        
        return new Response('Archivo no encontrado', { 
          status: 404, 
          headers: securityHeaders 
        });
      }
    } catch (error) {
      console.error('Error general en el worker:', error);
      return new Response('Error interno del servidor', {
        status: 500,
        headers: securityHeaders,
      });
    }
  },
};
