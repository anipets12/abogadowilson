import { handleApiRequest } from '../src/api/router';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const url = new URL(request.url);
    return await handleApiRequest(request, url);
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      
      if (url.pathname.startsWith('/api/ebooks')) {
        // Manejar rutas de API
        if (url.pathname.endsWith('/download')) {
          return handleDownload(request, env);
        }
        
        return handleEbookMetadata(request, env);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response('Server Error', { status: 500 });
    }
  }
};

async function handleDownload(request, env) {
  const authorization = request.headers.get('Authorization');
  if (!authorization) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Verificar token JWT
  try {
    const token = authorization.split(' ')[1];
    const payload = await env.JWT.verify(token);
    
    // Obtener metadata del ebook
    const ebookId = request.url.split('/').pop();
    const ebook = await env.EBOOKS.get(ebookId);
    
    if (!ebook) {
      return new Response('Ebook not found', { status: 404 });
    }

    // Generar URL firmada para R2
    const url = await env.R2.createSignedUrl({
      bucket: 'ebooks',
      key: `${ebookId}.pdf`,
      expiresIn: 3600 // 1 hora
    });

    return new Response(JSON.stringify({ url }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}
