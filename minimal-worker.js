/**
 * SOLUCIÓN MÍNIMA GARANTIZADA PARA CLOUDFLARE WORKERS
 * Esta implementación simplificada garantiza que la aplicación funcione
 * sin depender de bibliotecas externas que puedan fallar
 */

// Evento principal que Cloudflare invoca
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// Manejador principal de solicitudes
async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Manejo de CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    });
  }
  
  // Manejar favicon.ico directamente
  if (url.pathname === '/favicon.ico') {
    // Mini SVG logo como favicon
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#2563eb"/><path d="M30,30 L70,30 L70,70 L30,70 Z" stroke="white" fill="none" stroke-width="5"/></svg>`;
    
    return new Response(svgIcon, {
      status: 200,
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }

  // Si la URL tiene una extensión, es un recurso estático
  const isStaticResource = url.pathname.includes('.');
  
  try {
    // Para recursos estáticos, intentar servirlos desde el origen
    if (isStaticResource) {
      const response = await fetch(request);
      if (response.ok) {
        return response;
      }
    }
    
    // Para rutas SPA o recursos no encontrados, servir index.html
    const indexResponse = await fetch(`${url.origin}/index.html`);
    return new Response(indexResponse.body, {
      status: 200,
      headers: indexResponse.headers
    });
  } catch (error) {
    // Si todo falla, mostrar un HTML de emergencia
    return new Response(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Abogado Wilson</title>
        <style>
          body { font-family: system-ui, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #2563eb; }
          p { max-width: 600px; margin: 15px auto; }
          button { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>Estamos experimentando dificultades técnicas</h1>
        <p>Nuestro equipo ha sido notificado y está trabajando para resolver el problema.</p>
        <p>Serás redirigido a la página principal en 5 segundos.</p>
        <button onclick="window.location.href='/'">Ir a la página principal ahora</button>
        <script>setTimeout(() => window.location.href = '/', 5000);</script>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
