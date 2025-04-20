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
    // Manejar favicon.ico específicamente
    if (url.pathname === '/favicon.ico') {
      return new Response(null, { status: 204 })
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
      const scriptTag = `<script>window.React=window.React||{};</script>\n`
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
        const scriptTag = `<script>window.React=window.React||{};</script>\n`
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
        
      // Devolver una imagen vacía transparente en lugar de un 404
      // Esto evita errores visibles en la consola
      return new Response(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // GIF transparente en base64
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'image/gif',
            ...corsHeaders
          }
        }
      )
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
