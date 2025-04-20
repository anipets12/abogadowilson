import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * Worker para servir sitio estático SPA con Cloudflare Workers
 */
addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    event.respondWith(new Response('Error interno del servidor', { status: 500 }))
  }
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  
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
      }
    }
    
    // Intenta obtener el activo desde KV
    const page = await getAssetFromKV(event, options)
    
    // Devolver activo con headers adicionales
    const response = new Response(page.body, page)
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade')
    response.headers.set('Access-Control-Allow-Origin', '*')
    
    return response
  } catch (e) {
    // Si ocurre un error, intentar servir index.html para SPA
    if (!url.pathname.includes('.')) {
      try {
        const notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req)
        })
        
        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 200
        })
      } catch (e) {
        // Si todo falla, devolver una respuesta amigable
        return new Response('Página en mantenimiento. Por favor, intente más tarde.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
        })
      }
    }
    
    // Para recursos estáticos no encontrados
    return new Response('Recurso no encontrado', { 
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
