import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * Worker para servir sitio estático SPA con Cloudflare Workers
 * Versión mejorada con soporte de CORS, manejo de errores React, y headers optimizados
 */
addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    console.error('Error en worker:', e)
    event.respondWith(new Response('Error interno del servidor', { status: 500 }))
  }
})

// Configuración de CORS para permitir solicitudes a Supabase y otros orígenes
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey, X-Supabase-Auth',
  'Access-Control-Max-Age': '86400',
}

async function handleEvent(event) {
  const url = new URL(event.request.url)
  const request = event.request
  
  // Manejar solicitudes OPTIONS para CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    })
  }
  
  try {
    // Manejar favicon específicamente (tanto .ico como .svg)
    if (url.pathname === '/favicon.ico' || url.pathname === '/favicon.svg') {
      // Devolvemos un favicon SVG simple en línea
      const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#1a5fb4"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="20" fill="white">W</text>
      </svg>`;
      
      return new Response(svgFavicon, { 
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
      // Evitar errores de Turnstile
      window.turnstileSitekey = "0x4AAAAAABDkl--Sw4n_bwmU";
      // Compatibilidad para prevenir errores en versiones antiguas
      window.global = window;
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
  } catch (e) {
    console.error('Error al servir activo:', e)
    
    // Si ocurre un error, intentar servir index.html para SPA
    if (!url.pathname.includes('.')) {
      try {
        const notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req)
        })
        
        const originalHtml = await notFoundResponse.text()
        
        // Modificar el HTML para inyectar script global de React
        const scriptTag = `<script>
      // Configuración global para prevenir errores comunes
      window.React = window.React || {};
      // Evitar errores de Turnstile
      window.turnstileSitekey = "0x4AAAAAABDkl--Sw4n_bwmU";
      // Compatibilidad para prevenir errores en versiones antiguas
      window.global = window;
      </script>
`
        const modifiedHtml = originalHtml.replace('<head>', `<head>\n${scriptTag}`)
        
        const headers = new Headers(notFoundResponse.headers)
        
        // Agregar headers CORS
        for (const [key, value] of Object.entries(corsHeaders)) {
          headers.set(key, value)
        }
        
        return new Response(modifiedHtml, {
          status: 200,
          headers
        })
      } catch (e) {
        console.error('Error al servir index.html de respaldo:', e)
        // Si todo falla, devolver una respuesta amigable
        return new Response('Página en mantenimiento. Por favor, intente más tarde.', {
          status: 503,
          headers: { 
            'Content-Type': 'text/plain;charset=UTF-8',
            ...corsHeaders
          }
        })
      }
    }
    
    // Para recursos como imágenes, verificar si es un path común faltante y utilizar una alternativa
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
