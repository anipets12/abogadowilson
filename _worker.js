export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Manejar solicitudes CORS OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    try {
      // Pasar solicitudes a través de la función de assets de Cloudflare Pages
      return env.ASSETS.fetch(request);
    } catch (e) {
      // Si falla, intentar redirigir a index.html para SPA
      try {
        const indexRequest = new Request(`${url.origin}/index.html`, request);
        return env.ASSETS.fetch(indexRequest);
      } catch (indexError) {
        return new Response('Not found', { status: 404 });
      }
    }
  },
};
