/**
 * El worker más simple y compatible con Cloudflare Pages
 * https://developers.cloudflare.com/workers/examples/sites/
 */

export default {
  async fetch(request, env, ctx) {
    // Recuperamos la URL solicitada
    const url = new URL(request.url);
    
    try {
      // Para debugging, usar este header para ver qué bindings están disponibles
      if (url.pathname === '/debug') {
        const bindings = Object.keys(env).join(', ');
        return new Response(`Bindings disponibles: ${bindings}`, {
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      // Si es favicon.ico, devolver un status 204
      if (url.pathname === '/favicon.ico') {
        return new Response(null, { status: 204 });
      }
      
      // Intenta obtener el activo estático del namespace __STATIC_CONTENT
      let response = await env.__STATIC_CONTENT.fetch(request);

      // Si no se encontró el recurso y es una ruta sin extensión (SPA route)
      if (response.status === 404 && !url.pathname.includes('.')) {
        // Recuperar index.html para rutas SPA
        response = await env.__STATIC_CONTENT.fetch(new URL('/', url));
      }
      
      return response;
    } catch (e) {
      // En caso de error, devolver una respuesta simple
      return new Response(`Error: ${e.message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
