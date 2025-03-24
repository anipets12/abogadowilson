const { register, login, logout, getUser, createReferralLink } = require('./src/auth/auth.controller');
const { getPosts, getPost, createPost, addComment } = require('./src/forum/forum.controller');
const { initializeTokens, getTokens, useToken, refillTokens } = require('./src/tokens/tokens.controller');
const { authMiddleware, corsHeaders } = require('./src/middleware/auth');
const path = require('path');
const fs = require('fs');

// Handle OPTIONS requests for CORS
function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Handle API routes
async function handleApiRequest(request, url) {
  const pathname = url.pathname;
  
  // Auth routes
  if (pathname === '/api/auth/register' && request.method === 'POST') {
    return register(request);
  }
  if (pathname === '/api/auth/login' && request.method === 'POST') {
    return login(request);
  }
  if (pathname === '/api/auth/logout' && request.method === 'POST') {
    return logout(request);
  }
  if (pathname === '/api/auth/me' && request.method === 'GET') {
    return getUser(request);
  }
  if (pathname === '/api/auth/referral' && request.method === 'POST') {
    // Aplicar middleware de autenticación
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({
        success: false,
        message: authResult.message
      }), {
        status: 401,
        headers: corsHeaders
      });
    }
    return createReferralLink(request, authResult.user);
  }

  // Token routes
  if (pathname === '/api/tokens/initialize' && request.method === 'POST') {
    // Aplicar middleware de autenticación
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({
        success: false,
        message: authResult.message
      }), {
        status: 401,
        headers: corsHeaders
      });
    }
    return initializeTokens(request);
  }
  if (pathname.match(/^\/api\/tokens\/[a-f0-9-]+$/) && request.method === 'GET') {
    // Extraer el ID de usuario de la URL
    const userId = pathname.split('/').pop();
    
    // Aplicar middleware de autenticación
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({
        success: false,
        message: authResult.message
      }), {
        status: 401,
        headers: corsHeaders
      });
    }
    return getTokens(request, userId);
  }
  if (pathname === '/api/tokens/use' && request.method === 'POST') {
    // Aplicar middleware de autenticación
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({
        success: false,
        message: authResult.message
      }), {
        status: 401,
        headers: corsHeaders
      });
    }
    return useToken(request);
  }
  if (pathname === '/api/tokens/refill' && request.method === 'POST') {
    // Aplicar middleware de autenticación
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({
        success: false,
        message: authResult.message
      }), {
        status: 401,
        headers: corsHeaders
      });
    }
    return refillTokens(request);
  }
  
  // Forum routes
  if (pathname === '/api/forum/posts' && request.method === 'GET') {
    return getPosts(request);
  }
  if (pathname === '/api/forum/posts' && request.method === 'POST') {
    // Aplicar middleware de autenticación
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({
        success: false,
        message: authResult.message
      }), {
        status: 401,
        headers: corsHeaders
      });
    }
    return createPost(authResult.request);
  }
  if (pathname.startsWith('/api/forum/posts/') && request.method === 'GET') {
    const postId = pathname.split('/').pop();
    if (postId) {
      return getPost(request, postId);
    }
  }
  if (pathname.startsWith('/api/forum/posts/') && pathname.endsWith('/comments') && request.method === 'POST') {
    // Aplicar middleware de autenticación
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({
        success: false,
        message: authResult.message
      }), {
        status: 401,
        headers: corsHeaders
      });
    }
    
    const parts = pathname.split('/');
    const postId = parts[parts.length - 2];
    return addComment(authResult.request, postId);
  }

  // If no API route matched
  return new Response(JSON.stringify({
    success: false,
    message: 'API endpoint not found'
  }), {
    status: 404,
    headers: corsHeaders
  });
}

// Handle static file requests
async function handleFileRequest(request, url) {
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join(process.cwd(), 'public', pathname);
  
  try {
    // Check if file exists
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      const contentType = getContentType(pathname);
      
      return new Response(content, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          ...corsHeaders
        }
      });
    } else {
      // If file doesn't exist, serve index.html for client-side routing
      // This is important for SPA (Single Page Applications)
      const indexPath = path.join(process.cwd(), 'public', 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath);
        
        return new Response(content, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
            ...corsHeaders
          }
        });
      } else {
        return new Response('File not found', {
          status: 404,
          headers: corsHeaders
        });
      }
    }
  } catch (error) {
    console.error('File serving error:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Get content type based on file extension
function getContentType(pathname) {
  const extension = pathname.split('.').pop().toLowerCase();
  const contentTypes = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon'
  };
  
  return contentTypes[extension] || 'text/plain';
}

// Main request handler
async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    
    // Handle CORS preflight request
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }
    
    // Route API requests
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, url);
    }
    
    // Serve static files
    return handleFileRequest(request, url);
    
  } catch (error) {
    console.error('Request handling error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
require('http')
  .createServer((req, res) => {
    // Convert req/res to Request/Response format
    const request = new Request(`http://${req.headers.host}${req.url}`, {
      method: req.method,
      headers: new Headers(req.headers),
      body: ['GET', 'HEAD'].includes(req.method) ? null : req
    });
    
    handleRequest(request)
      .then(response => {
        // Set status code and headers
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });
        
        // Get response body
        return response.arrayBuffer();
      })
      .then(body => {
        res.end(Buffer.from(body));
      })
      .catch(error => {
        console.error('Server error:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
  })
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
