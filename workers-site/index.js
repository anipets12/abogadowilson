import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * Worker alternativo compatible con Cloudflare Workers Sites
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
    
    // Intentar obtener el recurso estático
    const options = {
      // Si la ruta no contiene un punto (sin extensión), servir index.html para SPA
      mapRequestToAsset: req => {
        const requestURL = new URL(req.url)
        if (!requestURL.pathname.includes('.')) {
          return new Request(`${requestURL.origin}/index.html`, req)
        }
        return req
      }
    }
    
    const page = await getAssetFromKV(event, options)
    const response = new Response(page.body, page)
    
    // Agregar headers de seguridad
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Access-Control-Allow-Origin', '*')
    
    return response
  } catch (e) {
    // Si es una ruta SPA sin extensión, intentar servir index.html
    if (!url.pathname.includes('.')) {
      try {
        const page = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req)
        })
        return new Response(page.body, page)
      } catch (e) {
        // Si todo falla, mostrar error amigable
        return new Response('Página no encontrada', { status: 404 })
      }
    }
    
    return new Response('Recurso no encontrado', { status: 404 })
  }
}
