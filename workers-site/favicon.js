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
 */
export async function handleFaviconRequest(event, corsHeaders) {
  const url = new URL(event.request.url);
  let faviconPath = '';
  let contentType = '';
  
  if (url.pathname === '/favicon.ico') {
    faviconPath = 'favicon.ico';
    contentType = 'image/x-icon';
  } else if (url.pathname === '/favicon.svg') {
    faviconPath = 'favicon.svg';
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
    // Intentar buscar el favicon en el almacenamiento
    const { getAssetFromKV } = require('@cloudflare/kv-asset-handler');
    
    try {
      // Intentar servir directamente desde el directorio public
      const response = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/${faviconPath}`, req)
      });
      
      if (response && response.status === 200) {
        const headers = new Headers(response.headers);
        headers.set('Cache-Control', 'public, max-age=86400');
        
        // Añadir encabezados CORS
        Object.entries(corsHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });
        
        return new Response(response.body, {
          status: 200,
          headers
        });
      }
    } catch (e) {
      console.error('Error cargando favicon desde KV:', e);
    }
    
    // Si no se pudo obtener desde KV o falló de alguna manera, usar el SVG predeterminado
    if (contentType === 'image/svg+xml') {
      return new Response(DEFAULT_FAVICON_SVG, { 
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
          ...corsHeaders
        }
      });
    }
    
    // Para favicon.ico, crear una respuesta vacía con 200 para evitar errores en la consola
    return new Response(null, { 
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        ...corsHeaders
      }
    });
  } catch (e) {
    console.error('Error general en el manejo del favicon:', e);
    
    // Si todo falla, devolver una respuesta con código 200 pero vacía para evitar errores
    return new Response(null, { 
      status: 200,
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=86400',
        ...corsHeaders
      }
    });
  }
}
