// Worker para Cloudflare Workers que usa getAssetFromKV
// Compatibilidad garantizada con el enfoque tradicional

import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

// Evento principal que Cloudflare invoca
addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

/**
 * Maneja todas las solicitudes web
 */
async function handleEvent(event) {
  const url = new URL(event.request.url)
  
  // Caso especial para favicon.ico - devolver respuesta vacía
  if (url.pathname === '/favicon.ico') {
    return new Response(null, { status: 204 })
  }
  
  try {
    // Opciones para manejar rutas SPA
    const options = {
      mapRequestToAsset: req => {
        // Servir index.html para rutas sin extensión (rutas SPA)
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
    // Si ocurre un error, intentar servir index.html
    try {
      const notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req)
      })
      
      return new Response(notFoundResponse.body, {
        ...notFoundResponse,
        status: 200
      })
    } catch (e) {
      // Mensaje de error amigable para el usuario final
      return new Response('Esta página no está disponible en este momento. Por favor, intente más tarde.', {
        status: 500,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      })
    }
  }
}
