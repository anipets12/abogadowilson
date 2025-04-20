/**
 * Manejo optimizado de favicon para Cloudflare Workers
 * Proporciona soporte para favicon.ico y favicon.svg con fallback incluido
 */

// SVG favicon simple como respaldo
export const DEFAULT_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
  <rect width="100" height="100" rx="20" fill="#2563eb"/>
  <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
  <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
  <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
</svg>`;

/**
 * Maneja solicitudes de favicon
 * 
 * @param {FetchEvent} event - El evento fetch de Cloudflare Workers
 * @param {Object} corsHeaders - Los encabezados CORS a aplicar
 * @returns {Response} Una respuesta HTTP con el favicon solicitado
 */
export async function handleFaviconRequest(event, corsHeaders) {
  const url = new URL(event.request.url);
  let contentType = '';
  
  // Determinar el tipo de contenido basado en la extensión solicitada
  if (url.pathname === '/favicon.ico') {
    contentType = 'image/x-icon';
  } else if (url.pathname === '/favicon.svg') {
    contentType = 'image/svg+xml';
  } else {
    // Si no es una ruta de favicon conocida, usar el SVG predeterminado
    return new Response(DEFAULT_FAVICON_SVG, { 
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        ...corsHeaders
      }
    });
  }

  try {
    // Para evitar error 404, siempre usamos el SVG predeterminado
    // independientemente de la extensión solicitada
    return new Response(DEFAULT_FAVICON_SVG, { 
      status: 200,
      headers: {
        'Content-Type': contentType === 'image/x-icon' ? 'image/x-icon' : 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        ...corsHeaders
      }
    });
  } catch (e) {
    console.error('Error al servir favicon:', e);
    // Respuesta fallback para cualquier error
    return new Response(DEFAULT_FAVICON_SVG, { 
      status: 200,
      headers: {
        'Content-Type': contentType === 'image/x-icon' ? 'image/x-icon' : 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        ...corsHeaders
      }
    });
  }
}
