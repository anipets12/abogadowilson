import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import { handleChatRequest } from './api/chat'
import { handleSupabaseProxy, checkSupabaseConnection } from './api/supabase-proxy'

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
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
  <rect width="100" height="100" rx="20" fill="#2563eb"/>
  <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
  <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
  <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
</svg>`;

// Modo de depuración para mostrar errores detallados
const DEBUG = false;

async function handleEvent(event) {
  const url = new URL(event.request.url)
  const request = event.request
  
  // Manejar favicon específicamente (tanto .ico como .svg)
  if (url.pathname === '/favicon.ico' || url.pathname === '/favicon.svg') {
    // Devolvemos un favicon SVG mejorado en línea
    return new Response(faviconSvg, { 
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
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
  const page = await getAssetFromKV(event, options)
  
  // Devolver activo con headers optimizados
  const response = new Response(page.body, page)
  
  // Headers de seguridad
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade')
  
  // Headers CORS completos
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value)
  }
  
  // Agregar headers especiales para archivos HTML para ayudar con React 
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('text/html')) {
    // Injectar script global React para evitar errores de 'React is not defined'
    const originalHtml = await page.text()
    const scriptTag = `<script>
      // Configuración global para prevenir errores comunes
      window.React = window.React || {};
      // Asegurar que React.createElement está disponible para evitar errores en router.js
      window.React.createElement = window.React.createElement || function() { return document.createElement.apply(document, arguments); };
      // Evitar errores de Turnstile
      window.turnstileSitekey = "0x4AAAAAABDkl--Sw4n_bwmU";
      // Compatibilidad para prevenir errores en versiones antiguas
      window.global = window;
      // Parche para errores de undefined en router.js
      window.__patchForCloudflare = function() {
        if (typeof e === 'undefined' && arguments.length > 0) return arguments[0];
        return e;
      };
      </script>
`
    const modifiedHtml = originalHtml.replace('<head>', `<head>\n${scriptTag}`)
    
    return new Response(modifiedHtml, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    })
  }
  
  return response
}

// Manejar solicitudes API
async function handleApiRequest(event, url) {
  const request = event.request;
  
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
  
  // Endpoint para comprobar la conectividad con Supabase
  if (pathname === '/api/check-connection') {
    return new Response(JSON.stringify({ connected: true, timestamp: Date.now() }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Default response for unhandled API routes
  return new Response(JSON.stringify({ error: 'API route not found', path: pathname }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json'
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

// Código movido al archivo api/chat.js para mejor organización
    if (url.pathname.includes('/images/') || url.pathname.endsWith('.jpg') || 
        url.pathname.endsWith('.png') || url.pathname.endsWith('.svg')) {
        
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
    
    // Para recursos estáticos no encontrados
    return new Response('Recurso no encontrado', { 
      status: 404,
      headers: { 
        'Content-Type': 'text/plain',
        ...corsHeaders 
      }
    })
  }
}
