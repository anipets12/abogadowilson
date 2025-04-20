// Worker para Cloudflare Pages - Patrón oficial recomendado

/**
 * El método principal que Cloudflare invoca para manejar las solicitudes
 */
export default {
  async fetch(request, env, ctx) {
    // Tomar la URL de la solicitud
    const url = new URL(request.url);
    
    try {
      // Primero intenta obtener el archivo estático solicitado
      let asset = await env.ASSETS.fetch(request.clone());
      
      // Si la petición fue exitosa, devolver el asset
      if (asset.status < 400) {
        return asset;
      }
      
      // Si es una ruta de aplicación (sin extensión de archivo), servir index.html
      if (!url.pathname.includes('.')) {
        // Redirigir a index.html para manejar rutas de SPA
        let indexRequest = new Request(`${url.origin}/index.html`, request);
        asset = await env.ASSETS.fetch(indexRequest);
        // En lugar de error 404, enviamos un 200 con el contenido de index.html
        return new Response(asset.body, {
          ...asset,
          status: 200
        });
      }
      
      // Si solicitaron favicon.ico y no existe, devolvemos un Response vacío 204
      // para evitar errores en el navegador
      if (url.pathname === '/favicon.ico') {
        return new Response(null, { status: 204 });
      }
      
      // Para cualquier otro caso, devolver la respuesta original
      return asset;
    } catch (e) {
      // Log del error para depuración
      console.error("Error en el worker:", e);
      
      // Devolver una respuesta de error amigable
      return new Response(`Servidor en mantenimiento. Por favor, intente más tarde.`, {
        status: 503,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      });
    }
  }
};

