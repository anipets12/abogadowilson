const { register, login, logout } = require('./src/auth/auth.controller');
const { getPosts, getPost, createPost, addComment } = require('./src/forum/forum.controller');
const path = require('path');
const fs = require('fs');

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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
  
  // Forum routes
  if (pathname === '/api/forum/posts' && request.method === 'GET') {
    return getPosts(request);
  }
  if (pathname === '/api/forum/posts' && request.method === 'POST') {
    return createPost(request);
  }
  if (pathname.match(/^\/api\/forum\/posts\/[a-zA-Z0-9-_]+$/) && request.method === 'GET') {
    const postId = pathname.split('/').pop();
    return getPost(request, postId);
  }
  if (pathname.match(/^\/api\/forum\/posts\/[a-zA-Z0-9-_]+\/comments$/) && request.method === 'POST') {
    const postId = pathname.split('/')[4];
    return addComment(request, postId);
  }
  
  // If no route matches
  return new Response(JSON.stringify({
    success: false,
    message: 'Route not found'
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Handle static files
async function handleStaticRequest(request, url) {
  const __dirname = path.resolve();
  let filePath;
  
  // Default to index.html for the root path
  if (url.pathname === '/' || url.pathname === '') {
    filePath = path.join(__dirname, 'dist', 'index.html');
  } else {
    // Remove leading slash and join with dist directory
    const relativePath = url.pathname.replace(/^\/+/, '');
    filePath = path.join(__dirname, 'dist', relativePath);
  }
  
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Determine content type based on file extension
    const ext = path.extname(filePath);
    let contentType = 'text/plain';
    
    switch (ext) {
      case '.html':
        contentType = 'text/html';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.js':
        contentType = 'application/javascript';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
    }
    
    return new Response(fileContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error serving static file:', error);
    
    // If the file is not found, serve index.html (for SPA routing)
    try {
      const indexContent = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');
      return new Response(indexContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('Error serving index.html:', error);
      return new Response('File not found', {
        status: 404,
        headers: corsHeaders
      });
    }
  }
}

// Main request handler
const handler = async (request) => {
  try {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }
    
    // If the path starts with /api, handle as API request
    if (url.pathname.startsWith('/api')) {
      return handleApiRequest(request, url);
    }
    
    // Otherwise, serve static files
    return handleStaticRequest(request, url);
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
};

export default handler;
