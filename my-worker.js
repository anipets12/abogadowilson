// Archivo worker para sitio estático con soporte SPA

export default {
  async fetch(request, env, ctx) {
    try {
      // Obtener la URL de la solicitud
      const url = new URL(request.url);
      const path = url.pathname;

      // Verifica si es un archivo estático (tiene extensión)
      const hasExtension = path.includes('.');
      
      // Si no tiene extensión, devolvemos index.html para manejo de SPA
      if (!hasExtension && path !== '/') {
        // Obtener index.html
        return await env.ASSETS.fetch(new URL('/', url));
      }

      // Para todas las demás solicitudes, simplemente buscar el archivo estático
      return await env.ASSETS.fetch(request);
    } catch (error) {
      // En caso de error, intentar servir index.html
      try {
        const url = new URL(request.url);
        return await env.ASSETS.fetch(new URL('/', url));
      } catch {
        return new Response('Error interno del servidor', {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }
  }
};

