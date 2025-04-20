import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import { handleChatRequest } from './api/chat'
import { handleSupabaseProxy, checkSupabaseConnection } from './api/supabase-proxy'
import { handleSearches } from './api/searches'
import { handleLegalQueries } from './api/legal-queries'
import { handleBlogRequests } from './api/blog'
import { handleConfigRequest } from './api/config-handler'
import { handleProxyRequest } from './api/proxy-handler'
import { handleFaviconRequest, DEFAULT_FAVICON_SVG } from './favicon'

/**
 * Worker para servir sitio estático SPA con Cloudflare Workers
 * Versión mejorada con soporte de CORS, manejo de errores React, y headers optimizados
 */
addEventListener('fetch', event => {
  try {
    // Manejar solicitudes OPTIONS (CORS preflight) inmediatamente
    if (event.request.method === 'OPTIONS') {
      event.respondWith(handleOptions(event.request));
      return;
    }
    
    event.respondWith(handleEvent(event));
  } catch (e) {
    console.error('Error en el worker:', e);
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

// Configuración de CORS mejorada para permitir solicitudes a Supabase y otros orígenes
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS, DELETE, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey, X-Supabase-Auth, X-Auth-Token, X-Custom-Header, Pragma, Cache-Control',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
}

/**
 * Maneja solicitudes OPTIONS para CORS preflight
 */
function handleOptions(request) {
  return new Response(null, {
    headers: corsHeaders
  })
}

/**
 * Variables globales
 */
// Usando favicon desde el módulo favicon.js

// Modo de depuración para mostrar errores detallados
const DEBUG = false;

async function handleEvent(event) {
  const url = new URL(event.request.url)
  const request = event.request
  
  // Manejar solicitudes API
  if (url.pathname.startsWith('/api/')) {
    return handleApiRequest(event, url);
  }
  
  // Manejar favicon directamente sin depender de módulos externos
  if (url.pathname === '/favicon.ico' || url.pathname === '/favicon.svg') {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
      <rect width="100" height="100" rx="20" fill="#2563eb"/>
      <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
      <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
      <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
    
    return new Response(svgContent, {
      status: 200,
      headers: {
        'Content-Type': url.pathname === '/favicon.ico' ? 'image/x-icon' : 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        ...corsHeaders
      }
    });
  }
  
  // Opciones para servir activos estáticos
  const options = {
    // Si la ruta no contiene un punto (sin extensión), servir index.html para SPA
    mapRequestToAsset: req => {
      const url = new URL(req.url)
      if (!url.pathname.includes('.')) {
        return new Request(`${url.origin}/index.html`, req)
      }
      return req
    },
    // Configuración adicional para el manejo de la caché
    cacheControl: {
      // Archivos de CSS y JavaScript tienen un tiempo de caché de un día
      byExtension: {
        js: {
          edgeTTL: 86400,
          browserTTL: 86400,
        },
        css: {
          edgeTTL: 86400,
          browserTTL: 86400,
        },
        // Recursos estáticos como imágenes tienen una caché más larga
        jpg: {
          edgeTTL: 604800,
          browserTTL: 604800,
        },
        jpeg: {
          edgeTTL: 604800,
          browserTTL: 604800,
        },
        png: {
          edgeTTL: 604800,
          browserTTL: 604800,
        },
        svg: {
          edgeTTL: 604800,
          browserTTL: 604800,
        },
        ico: {
          edgeTTL: 604800,
          browserTTL: 604800,
        },
      },
    },
  }
  
  // Intenta obtener el activo desde KV
  try {
    // Lista completa de rutas SPA conocidas que debemos manejar
    const spaRoutes = [
      '/', 
      '/about', 
      '/services', 
      '/contact', 
      '/blog', 
      '/blog/', 
      '/consultations', 
      '/consultations/', 
      '/legal',
      '/terms',
      '/privacy',
      '/auth',
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/dashboard',
      '/dashboard/tokens',
      '/dashboard/consultations',
      '/login',
      '/register',
      '/registro',
      '/ebooks',
      '/ebooks/',
      '/ebookstore',
      '/civil',
      '/penal',
      '/comercial',
      '/aduanas',
      '/transito',
      '/newslettersignup',
      '/newsletter',
      '/newsletter-signup',
      '/reset-password',
      '/forgot-password',
      '/contacto'
    ];
    
    // Verificar si la URL contiene un punto, lo que indica un archivo estático (ej. .js, .css, .png)
    const hasFileExtension = url.pathname.includes('.');
    
    // Las rutas sin extensión se tratan como rutas de SPA
    if (!hasFileExtension || url.pathname.startsWith('/blog/post/')) {
      console.log('Sirviendo aplicación SPA para ruta:', url.pathname);
      
      try {
        // Intentar servir index.html para todas las rutas SPA
        const response = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${url.origin}/index.html`, req)
        });
        
        // Añadir encabezados CORS y de caché optimizados
        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type');
        headers.set('Cache-Control', 'no-cache');
        
        return new Response(response.body, {
          status: 200,
          headers
        });
      } catch (err) {
        console.error('Error al servir SPA:', err);
        // Continuamos a intentar servir el asset específico
      }
    }
    
    // Para otras peticiones, intentar servir el recurso estático
    const response = await getAssetFromKV(event);
    
    // Añadir encabezados CORS
    const headers = new Headers(response.headers);
    
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (e) {
    console.error('Error al procesar solicitud para:', url.pathname, e);
    
    // Para cualquier error, incluidos 404, servir siempre index.html para rutas SPA
    // Esto garantiza que React Router maneje las rutas correctamente
    try {
      console.log('Intentando servir SPA como fallback para:', url.pathname);
      const response = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${url.origin}/index.html`, req)
      });
      
      const headers = new Headers(response.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      headers.set('Cache-Control', 'no-cache');
      
      return new Response(response.body, {
        status: 200,  // Siempre devolver 200 para que React Router maneje la navegación
        headers
      });
    } catch (fallbackError) {
      console.error('Error crítico, incluso el fallback falló:', fallbackError);
      
      // Si todo falla, crear una página HTML de error que redirija al usuario a la página principal
      const errorHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Abogado Wilson - Error Temporal</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #2563eb; }
          p { margin: 20px 0; }
          button { background: #2563eb; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; }
        </style>
        <script>
          // Redireccionar a la página principal después de 5 segundos
          setTimeout(() => {
            window.location.href = '/';
          }, 5000);
        </script>
      </head>
      <body>
        <h1>Estamos experimentando dificultades técnicas</h1>
        <p>Nuestro equipo ha sido notificado y está trabajando para resolver el problema.</p>
        <p>Serás redirigido a la página principal en 5 segundos.</p>
        <button onclick="window.location.href='/'">Ir a la página principal ahora</button>
      </body>
      </html>
      `;
      
      return new Response(errorHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders
        }
      });
    }
  }
}

// Manejar solicitudes API
async function handleApiRequest(event, url) {
  const request = event.request;
  
  // Configuración endpoint - Resuelve la configuración para la aplicación
  if (url.pathname.startsWith('/api/config')) {
    return handleConfigRequest(event);
  }
  
  // Proxy endpoint - Mecanismo general para evitar problemas CORS
  if (url.pathname.startsWith('/api/proxy')) {
    return handleProxyRequest(event);
  }
  
  // Proxy Supabase - Interceptar todas las solicitudes a /api/supabase/
  if (url.pathname.startsWith('/api/supabase')) {
    // Extraer el path relativo de Supabase quitando /api/supabase
    const supabasePath = url.pathname.replace('/api/supabase', '');
    return handleSupabaseProxy(request, supabasePath);
  }
  
  // Verificación de conexión a Supabase
  if (url.pathname === '/api/check-connection') {
    return checkSupabaseConnection();
  }
  
  // API de chat
  if (url.pathname === '/api/chat') {
    return handleChatRequest(request);
  }
  
  // API de verificación Turnstile
  if (url.pathname === '/api/verify-turnstile') {
    return handleTurnstileVerification(request);
  }
  
  // API para búsquedas recientes
  if (url.pathname === '/api/data/searches') {
    return handleSearches(request);
  }

  // API para consultas legales
  if (url.pathname === '/api/data/legal-queries') {
    return handleLegalQueries(request);
  }

  // API para blog
  if (url.pathname.startsWith('/api/blog')) {
    return handleBlogRequests(request);
  }

  // Respuesta detallada para rutas API no encontradas
  return new Response(JSON.stringify({
    error: 'API route not found',
    path: url.pathname,
    availableRoutes: [
      '/api/config', 
      '/api/proxy', 
      '/api/supabase/*', 
      '/api/check-connection',
      '/api/chat',
      '/api/verify-turnstile',
      '/api/data/searches',
      '/api/data/legal-queries',
      '/api/blog/*'
    ]
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    },
  });
}

/**
 * Maneja la verificación de Turnstile
 */
async function handleTurnstileVerification(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const token = body.token;
    const action = body.action || 'login';
    const ip = request.headers.get('CF-Connecting-IP');

    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verificación real de Turnstile
    const formData = new FormData();
    formData.append('secret', '0x4AAAAAABDkl-wPYTurHAniMDA2wqOJ__k');
    formData.append('response', token);
    formData.append('remoteip', ip);
    
    const verificationResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    
    const verificationResult = await verificationResp.json();
    
    if (verificationResult.success) {
      return new Response(JSON.stringify({ 
        success: true, 
        action: action,
        score: 0.9, // Turnstile no da un score, pero podemos simularlo
        verification: verificationResult
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Verificación fallida', 
        details: verificationResult
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error('Error en verificación Turnstile:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Maneja solicitudes de imágenes no encontradas generando placeholders
 */
async function handleMissingImage(url) {
  // Intentamos generar un placeholder basado en la URL
  let placeholderImage;
  let contentType;
  
  if (url.pathname.endsWith('.svg')) {
    // SVG placeholder con el nombre del archivo
    const filename = url.pathname.split('/').pop().split('.')[0];
    placeholderImage = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#f0f0f0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#888">${filename}</text>
    </svg>`;
    contentType = 'image/svg+xml';
  } else {
    // Para JPG/PNG usamos un GIF transparente base64
    placeholderImage = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    contentType = 'image/gif';
  }
  
  return new Response(
    placeholderImage, 
    { 
      status: 200, 
      headers: { 
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        ...corsHeaders
      }
    }
  );
}
